import type { AdminRole } from '@/lib/auth/permissions';
import type { AuthMeReadResponse, AuthTokenPairResponse } from './interface.response';
import type { AuthMeSchema, AuthTokenPairSchema } from './interface.schema';

export const authMeReadResponse2AuthMeSchema = (api: AuthMeReadResponse): AuthMeSchema => ({
  id: api.id,
  email: api.email,
  displayName: api.displayName,
  role: api.role as AdminRole,
  permissions: api.permissions ?? [],
  isActive: api.isActive,
});

export const authTokenPairResponse2AuthTokenPairSchema = (
  api: AuthTokenPairResponse
): AuthTokenPairSchema => ({ accessToken: api.accessToken, refreshToken: api.refreshToken });
