import type { AdminRole, PermissionKey } from '@/lib/auth/permissions';

export interface UserFormSchema {
  email: string;
  /** Required on create; empty means "keep" on update. */
  password: string;
  displayName: string;
  role: AdminRole;
  permissions: PermissionKey[];
  isActive: boolean;
}
