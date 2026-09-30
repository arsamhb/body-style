import type { UserFormSchema } from './interface.form';
import type { AdminUsersCreatePayload, AdminUsersUpdatePayload } from './interface.payload';

export const userFormSchema2AdminUsersCreatePayload = (
  form: UserFormSchema
): AdminUsersCreatePayload => ({
  email: form.email.trim().toLowerCase(),
  password: form.password,
  displayName: form.displayName.trim(),
  role: form.role,
  permissions: form.role === 'developer' ? [] : form.permissions,
});

export const userFormSchema2AdminUsersUpdatePayload = (
  form: UserFormSchema,
  options?: { isSelf?: boolean }
): AdminUsersUpdatePayload => ({
  email: form.email.trim().toLowerCase(),
  displayName: form.displayName.trim(),
  ...(form.password ? { password: form.password } : {}),
  ...(options?.isSelf
    ? {}
    : {
        role: form.role,
        permissions: form.role === 'developer' ? [] : form.permissions,
        isActive: form.isActive,
      }),
});
