import * as Yup from 'yup';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/routing';
import { CONTACT_WAY_TYPES } from '@/features/site/types';

/** LocalizedString rules mirror the server: only supported keys; default locale required when asked. */
export const localizedString = ({ required = false, max = 2000 } = {}) => {
  let schema = Yup.object(
    Object.fromEntries(
      SUPPORTED_LOCALES.map((code) => [code, Yup.string().max(max, 'validation.tooLong')])
    )
  );
  if (required) {
    schema = schema.test('default-locale', 'validation.defaultLocaleRequired', (v) =>
      Boolean(v && typeof v[DEFAULT_LOCALE] === 'string' && (v[DEFAULT_LOCALE] as string).trim())
    );
  }
  return schema;
};

export const hrefSchema = Yup.string()
  .trim()
  .matches(/^(\/[^\s]*|https?:\/\/[^\s]+)$/, 'validation.href')
  .required('validation.required');

const navItemSchema = Yup.object({
  id: Yup.string(),
  label: localizedString({ required: true, max: 60 }),
  href: hrefSchema,
  order: Yup.number(),
  enabled: Yup.boolean(),
});

const contactWaySchema = Yup.object({
  id: Yup.string(),
  type: Yup.string()
    .oneOf([...CONTACT_WAY_TYPES])
    .required('validation.required'),
  icon: Yup.string(),
  label: localizedString({ required: true, max: 60 }),
  value: Yup.string().trim().max(300).required('validation.required'),
  description: localizedString({ max: 200 }),
  showInFooter: Yup.boolean(),
  order: Yup.number(),
});

export const settingsBrandingValidationSchema = Yup.object({
  siteName: localizedString({ required: true, max: 80 }),
  slogan: localizedString({ max: 200 }),
  logoUrl: Yup.string(),
  logoDarkUrl: Yup.string(),
  faviconUrl: Yup.string(),
});

export const settingsNavigationValidationSchema = Yup.object({
  navbar: Yup.array().of(navItemSchema).max(12),
  footer: Yup.object({
    quickLinks: Yup.array().of(navItemSchema).max(12),
    text: localizedString({ max: 400 }),
    copyright: localizedString({ max: 120 }),
  }),
});

export const settingsContactValidationSchema = Yup.object({
  contactWays: Yup.array().of(contactWaySchema).max(12),
});

export const settingsSeoValidationSchema = Yup.object({
  titleTemplate: localizedString({ max: 120 }),
  description: localizedString({ max: 300 }),
  ogImageUrl: Yup.string(),
});

export const settingsLocalesValidationSchema = Yup.object({
  enabledLocales: Yup.array()
    .of(
      Yup.string()
        .oneOf([...SUPPORTED_LOCALES])
        .required()
    )
    .min(1),
});
