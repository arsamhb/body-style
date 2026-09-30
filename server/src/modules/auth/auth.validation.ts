import * as Yup from 'yup';
import { config } from '../../config/env';

/** Shared password policy (also used when developers create/update users). */
export const passwordSchema = Yup.string()
  .min(
    config.passwordMinLength,
    `Password must be at least ${config.passwordMinLength} characters`,
  )
  .max(128, 'Password must be at most 128 characters')
  .matches(/[A-Za-z]/, 'Password must contain a letter')
  .matches(/\d/, 'Password must contain a digit');

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('A valid email is required')
    .max(254)
    .required('Email is required'),
  password: Yup.string().max(128).required('Password is required'),
}).noUnknown(true, 'Unknown fields are not allowed');

export const refreshValidationSchema = Yup.object({
  refreshToken: Yup.string().max(2048).required('refreshToken is required'),
}).noUnknown(true, 'Unknown fields are not allowed');

export const logoutValidationSchema = refreshValidationSchema;

export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string()
    .max(128)
    .required('Current password is required'),
  newPassword: passwordSchema.required('New password is required'),
}).noUnknown(true, 'Unknown fields are not allowed');
