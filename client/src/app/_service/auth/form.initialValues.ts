import type { AuthLoginFormSchema, AuthPasswordFormSchema } from './interface.form';

export const getAuthLoginFormInitialValue = (
  overrides?: Partial<AuthLoginFormSchema>
): AuthLoginFormSchema => ({ email: '', password: '', ...overrides });

export const getAuthPasswordFormInitialValue = (): AuthPasswordFormSchema => ({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
