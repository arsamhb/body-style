import type { AdminRole, PermissionKey } from '@/lib/auth/permissions';

export interface UserSchema {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: PermissionKey[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserListSchema = UserSchema[];
