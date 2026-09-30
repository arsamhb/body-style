import type { UserFormSchema } from './interface.form';
import type { UserSchema } from './interface.schema';

export const getUserFormInitialValue = (user?: UserSchema): UserFormSchema => ({
  email: user?.email ?? '',
  password: '',
  displayName: user?.displayName ?? '',
  role: user?.role ?? 'admin',
  permissions: user?.permissions ?? [],
  isActive: user?.isActive ?? true,
});
