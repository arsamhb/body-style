import type { AdminRole, PermissionKey } from '@/lib/auth/permissions';

/** The signed-in back-office account. */
export interface AuthMeSchema {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: PermissionKey[];
  isActive: boolean;
}

export interface AuthTokenPairSchema {
  accessToken: string;
  refreshToken: string;
}
