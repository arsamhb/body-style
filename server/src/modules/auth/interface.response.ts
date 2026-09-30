import { PermissionKey } from '../../core/auth/permissions';

/** Login and refresh both return this pair (camelCase — matches the frontend auth service). */
export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AdminMeResponse {
  id: string;
  email: string;
  displayName: string;
  role: string;
  permissions: PermissionKey[];
  isActive: boolean;
}
