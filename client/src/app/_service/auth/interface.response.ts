import type { PermissionKey } from '@/lib/auth/permissions';

export interface AuthTokenPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthMeReadResponse {
  id: string;
  email: string;
  displayName: string;
  role: string;
  permissions: PermissionKey[];
  isActive: boolean;
}

export interface SuccessResponse {
  success: boolean;
}
