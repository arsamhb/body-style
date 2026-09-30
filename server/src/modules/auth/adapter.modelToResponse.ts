import { AdminDocument } from './auth.model';
import { AdminMeResponse } from './interface.response';

export const adminModel2AdminMeResponse = (
  admin: AdminDocument,
): AdminMeResponse => ({
  id: String(admin._id),
  email: admin.email,
  displayName: admin.displayName,
  role: admin.role,
  permissions: admin.role === 'developer' ? [] : admin.permissions,
  isActive: admin.isActive,
});
