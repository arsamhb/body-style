import * as Yup from 'yup';

export const PASSWORD_MIN_LENGTH = 10;

/** Mirrors the server policy: length + at least one letter and one digit. Messages are i18n keys. */
export const passwordFieldSchema = Yup.string()
  .min(PASSWORD_MIN_LENGTH, 'validation.passwordMin')
  .max(128, 'validation.passwordMax')
  .matches(/[A-Za-z]/, 'validation.passwordLetter')
  .matches(/\d/, 'validation.passwordDigit');

export const authLoginValidationSchema = Yup.object({
  email: Yup.string().trim().email('validation.email').required('validation.required'),
  password: Yup.string().required('validation.required'),
});

export const authPasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('validation.required'),
  newPassword: passwordFieldSchema.required('validation.required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'validation.passwordMismatch')
    .required('validation.required'),
});
