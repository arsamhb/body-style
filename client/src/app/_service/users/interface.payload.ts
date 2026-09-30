import type { AdminRole, PermissionKey } from '@/lib/auth/permissions';

export interface AdminUsersCreatePayload {
  email: string;
  password: string;
  displayName?: string;
  role?: AdminRole;
  permissions?: PermissionKey[];
}

export interface AdminUsersUpdatePayload {
  email?: string;
  password?: string;
  displayName?: string;
  role?: AdminRole;
  permissions?: PermissionKey[];
  isActive?: boolean;
}
