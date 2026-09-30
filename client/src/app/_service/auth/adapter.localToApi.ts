import type { AuthLoginFormSchema, AuthPasswordFormSchema } from './interface.form';
import type { AuthLoginCreatePayload, AuthPasswordCreatePayload } from './interface.payload';

export const authLoginFormSchema2AuthLoginCreatePayload = (
  form: AuthLoginFormSchema
): AuthLoginCreatePayload => ({ email: form.email.trim().toLowerCase(), password: form.password });

export const authPasswordFormSchema2AuthPasswordCreatePayload = (
  form: AuthPasswordFormSchema
): AuthPasswordCreatePayload => ({
  currentPassword: form.currentPassword,
  newPassword: form.newPassword,
});
