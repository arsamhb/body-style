import * as Yup from 'yup';
import { ADMIN_ROLES, PERMISSIONS } from '@/lib/auth/permissions';
import { passwordFieldSchema } from '../auth/validation';

const base = {
  email: Yup.string().trim().email('validation.email').required('validation.required'),
  displayName: Yup.string().trim().max(80, 'validation.max80'),
  role: Yup.string()
    .oneOf([...ADMIN_ROLES])
    .required(),
  permissions: Yup.array().of(
    Yup.string()
      .oneOf([...PERMISSIONS])
      .required()
  ),
  isActive: Yup.boolean(),
};

export const userCreateValidationSchema = Yup.object({
  ...base,
  password: passwordFieldSchema.required('validation.required'),
});

export const userUpdateValidationSchema = Yup.object({
  ...base,
  password: Yup.string().test('optional-password', 'validation.passwordMin', (value, ctx) => {
    if (!value) return true;
    try {
      passwordFieldSchema.validateSync(value);
      return true;
    } catch (e) {
      return ctx.createError({ message: (e as Yup.ValidationError).message });
    }
  }),
});
