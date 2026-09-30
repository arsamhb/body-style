'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useQueryClient } from '@tanstack/react-query';
import authService from '@/lib/auth/authService';
import { isRefreshing, setIsRefreshing, processQueue } from '@/lib/axiosInstance';
import { AUTH_LOGOUT_ROUTE, AUTH_REFRESH_ROUTE } from '@/app/_service/auth/route.api';
import { AUTH_ME_QUERY_KEY, useGetAuthMe } from '@/app/_service/auth/hook.query';
import type { AuthMeSchema } from '@/app/_service/auth/interface.schema';
import { hasPermission, isDeveloper, type PermissionKey } from '@/lib/auth/permissions';
import { useRouter } from '@/i18n/navigation';

export const ADMIN_LOGIN_PATH = '/admin/login';
export const ADMIN_HOME_PATH = '/admin';

interface TokenClaims {
  sub: string;
  email: string;
  role: string;
  permissions?: PermissionKey[];
  exp: number;
}

interface IAuthContext {
  isAuthenticated: boolean;
  token: string | null;
  initializing: boolean;
  /** Account from `GET /auth/me` (database truth). Falls back to token claims while loading. */
  me: AuthMeSchema | null;
  isDeveloper: boolean;
  can: (permission: PermissionKey) => boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  token: null,
  initializing: true,
  me: null,
  isDeveloper: false,
  can: () => false,
  login: () => {},
  logout: () => {},
});

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY_NAME ?? 'access';
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '');

const decodeClaims = (token: string | null): TokenClaims | null => {
  if (!token) return null;
  try {
    return jwtDecode<TokenClaims>(token);
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const silentRefreshRef = useRef<() => Promise<void>>(async () => {});
  const scheduleRefreshRef = useRef<(accessToken: string) => void>(() => {});

  const logout = useCallback(() => {
    const refreshToken = authService.getRefreshToken();
    // Best effort server-side revocation; the local session is cleared regardless.
    if (refreshToken) {
      axios.post(`${BASE_URL}${AUTH_LOGOUT_ROUTE}`, { refreshToken }).catch(() => {});
    }
    authService.clearSession();
    queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    router.push(ADMIN_LOGIN_PATH);
  }, [router, queryClient]);

  // Refs are (re)assigned in an effect, not during render. Declared before the other effects
  // so they are populated before the mount effect below calls scheduleRefreshRef.current.
  useEffect(() => {
    scheduleRefreshRef.current = (accessToken: string) => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      const claims = decodeClaims(accessToken);
      if (!claims) return; // malformed token — reactive interceptor will handle it
      const refreshInMs = claims.exp * 1000 - Date.now() - 60 * 1000; // 1 min before expiry
      if (refreshInMs <= 0) {
        silentRefreshRef.current();
        return;
      }
      refreshTimer.current = setTimeout(() => silentRefreshRef.current(), refreshInMs);
    };

    silentRefreshRef.current = async () => {
      if (isRefreshing) return;
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        logout();
        return;
      }
      setIsRefreshing(true);
      try {
        const response = await axios.post(`${BASE_URL}${AUTH_REFRESH_ROUTE}`, { refreshToken });
        const newAccessToken: string = response.data.accessToken;
        const newRefreshToken: string = response.data.refreshToken ?? refreshToken;
        authService.setSession(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);
        scheduleRefreshRef.current(newAccessToken);
      } catch (error) {
        processQueue(error, null);
        logout();
      } finally {
        setIsRefreshing(false);
      }
    };
  }, [logout]);

  const login = useCallback((accessToken: string, refreshToken: string) => {
    authService.setSession(accessToken, refreshToken);
    scheduleRefreshRef.current(accessToken);
  }, []);

  const handleAuthError = useCallback(() => logout(), [logout]);

  // Sync with authService + restore session on mount
  useEffect(() => {
    const stored = authService.getToken();
    if (stored) {
      // localStorage is only readable after mount; reading it during render would break hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(stored);
      scheduleRefreshRef.current(stored);
    }
    setInitializing(false);

    const handleAuthChange = (newToken: string | null) => setToken(newToken);
    authService.subscribe(handleAuthChange);
    return () => authService.unsubscribe(handleAuthChange);
  }, []);

  // Cross-tab storage sync
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== TOKEN_KEY) return;
      if (e.newValue) {
        authService.setToken(e.newValue);
        scheduleRefreshRef.current(e.newValue);
      } else {
        logout();
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [logout]);

  useEffect(() => {
    window.addEventListener('auth:error', handleAuthError);
    return () => window.removeEventListener('auth:error', handleAuthError);
  }, [handleAuthError]);

  const { data: me } = useGetAuthMe({ options: { enabled: !!token } });

  const claims = useMemo(() => decodeClaims(token), [token]);
  const subject = useMemo(
    () => me ?? (claims ? { role: claims.role, permissions: claims.permissions ?? [] } : null),
    [me, claims]
  );

  const authValue = useMemo<IAuthContext>(
    () => ({
      isAuthenticated: !!token,
      token,
      initializing,
      me: me ?? null,
      isDeveloper: isDeveloper(subject),
      can: (permission) => hasPermission(subject, permission),
      login,
      logout,
    }),
    [token, initializing, me, subject, login, logout]
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
