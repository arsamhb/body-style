import { AdminDocument } from '../auth/auth.model';
import { UserReadResponse } from './interface.response';

export const userModel2UserReadResponse = (
  user: AdminDocument,
): UserReadResponse => ({
  id: String(user._id),
  email: user.email,
  displayName: user.displayName,
  role: user.role,
  permissions: user.role === 'developer' ? [] : user.permissions,
  isActive: user.isActive,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
