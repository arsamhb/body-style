import { AdminRole, PermissionKey } from '../../core/auth/permissions';

export interface UserCreatePayload {
  email: string;
  password: string;
  displayName?: string;
  role?: AdminRole;
  permissions?: PermissionKey[];
}

export interface UserUpdatePayload {
  email?: string;
  password?: string;
  displayName?: string;
  role?: AdminRole;
  permissions?: PermissionKey[];
  isActive?: boolean;
}
