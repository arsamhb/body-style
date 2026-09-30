import type { AdminRole } from '@/lib/auth/permissions';
import type { AdminUsersListReadResponse, AdminUsersReadResponse } from './interface.response';
import type { UserListSchema, UserSchema } from './interface.schema';

export const adminUsersReadResponse2UserSchema = (api: AdminUsersReadResponse): UserSchema => ({
  id: api.id,
  email: api.email,
  displayName: api.displayName,
  role: api.role as AdminRole,
  permissions: api.permissions ?? [],
  isActive: api.isActive,
  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

export const adminUsersListReadResponse2UserListSchema = (
  api: AdminUsersListReadResponse
): UserListSchema => api.map(adminUsersReadResponse2UserSchema);
