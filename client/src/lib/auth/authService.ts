// ./src/lib/auth/authService.ts
import { tokenPersister, refreshTokenPersister } from '@/lib/persisters/tokenPersister';

class AuthService {
  private listeners: ((token: string | null) => void)[] = [];

  getToken(): string | null {
    return tokenPersister.get() || null;
  }

  setToken(token: string): void {
    tokenPersister.set(token);
    this.notify(token);
  }

  deleteToken(): void {
    tokenPersister.delete();
    this.notify(null);
  }

  getRefreshToken(): string | null {
    return refreshTokenPersister.get() || null;
  }

  setRefreshToken(token: string): void {
    refreshTokenPersister.set(token);
  }

  deleteRefreshToken(): void {
    refreshTokenPersister.delete();
  }

  // Call this on login — saves both tokens
  setSession(accessToken: string, refreshToken: string): void {
    this.setToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  // Call this on logout — clears both tokens
  clearSession(): void {
    this.deleteToken();
    this.deleteRefreshToken();
  }

  subscribe(listener: (token: string | null) => void): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: (token: string | null) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notify(token: string | null) {
    this.listeners.forEach((l) => l(token));
  }
}

const authService = new AuthService();

export default authService;
