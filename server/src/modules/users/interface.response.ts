import { PermissionKey } from '../../core/auth/permissions';

export interface UserReadResponse {
  id: string;
  email: string;
  displayName: string;
  role: string;
  permissions: PermissionKey[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
