import * as Yup from 'yup';
import { ADMIN_ROLES, PERMISSIONS } from '../../core/auth/permissions';
import { passwordSchema } from '../auth/auth.validation';

const permissionsSchema = Yup.array()
  .of(
    Yup.string()
      .oneOf([...PERMISSIONS], 'Unknown permission')
      .required(),
  )
  .max(PERMISSIONS.length);

export const userCreateValidationSchema = Yup.object({
  email: Yup.string()
    .email('A valid email is required')
    .max(254)
    .required('Email is required'),
  password: passwordSchema.required('Password is required'),
  displayName: Yup.string().trim().max(80).default(''),
  role: Yup.string()
    .oneOf([...ADMIN_ROLES])
    .default('admin'),
  permissions: permissionsSchema.default([]),
}).noUnknown(true, 'Unknown fields are not allowed');

export const userUpdateValidationSchema = Yup.object({
  email: Yup.string().email('A valid email is required').max(254),
  password: passwordSchema,
  displayName: Yup.string().trim().max(80),
  role: Yup.string().oneOf([...ADMIN_ROLES]),
  permissions: permissionsSchema,
  isActive: Yup.boolean(),
}).noUnknown(true, 'Unknown fields are not allowed');
