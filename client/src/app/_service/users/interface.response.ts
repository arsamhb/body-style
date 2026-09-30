import type { PermissionKey } from '@/lib/auth/permissions';

export interface AdminUsersReadResponse {
  id: string;
  email: string;
  displayName: string;
  role: string;
  permissions: PermissionKey[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AdminUsersListReadResponse = AdminUsersReadResponse[];
