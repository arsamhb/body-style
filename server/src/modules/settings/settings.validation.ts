import * as Yup from 'yup';
import { SUPPORTED_LOCALES } from '../../core/i18n/types';
import {
  hrefSchema,
  iconNameSchema,
  imageUrlSchema,
  itemIdSchema,
  localizedString,
} from '../../core/i18n/validation';
import { CONTACT_WAY_TYPES } from './settings.model';

const navItemSchema = Yup.object({
  id: itemIdSchema,
  label: localizedString({ required: true, max: 60, optional: true }),
  href: hrefSchema.required('href is required'),
  order: Yup.number().integer().min(0).default(0),
  enabled: Yup.boolean().default(true),
}).noUnknown(true, 'Unknown fields are not allowed');

const contactWaySchema = Yup.object({
  id: itemIdSchema,
  type: Yup.string()
    .oneOf([...CONTACT_WAY_TYPES])
    .required(),
  icon: iconNameSchema.default(''),
  label: localizedString({ required: true, max: 60, optional: true }),
  value: Yup.string().trim().max(300).required('value is required'),
  description: localizedString({ max: 200, optional: true }),
  showInFooter: Yup.boolean().default(true),
  order: Yup.number().integer().min(0).default(0),
}).noUnknown(true, 'Unknown fields are not allowed');

const optionalImage = imageUrlSchema
  .nullable()
  .transform((v) => (v === null ? '' : v));

export const settingsBrandingValidationSchema = Yup.object({
  siteName: localizedString({ required: true, max: 80, optional: true }),
  slogan: localizedString({ max: 200, optional: true }),
  logoUrl: optionalImage,
  logoDarkUrl: optionalImage,
  faviconUrl: optionalImage,
}).noUnknown(true, 'Unknown fields are not allowed');

export const settingsNavigationValidationSchema = Yup.object({
  navbar: Yup.array().of(navItemSchema).max(12),
  footer: Yup.object({
    quickLinks: Yup.array().of(navItemSchema).max(12),
    text: localizedString({ max: 400, optional: true }),
    copyright: localizedString({ max: 120, optional: true }),
  })
    .noUnknown(true, 'Unknown fields are not allowed')
    .default(undefined),
}).noUnknown(true, 'Unknown fields are not allowed');

export const settingsContactValidationSchema = Yup.object({
  contactWays: Yup.array().of(contactWaySchema).max(12).required(),
}).noUnknown(true, 'Unknown fields are not allowed');

export const settingsSeoValidationSchema = Yup.object({
  titleTemplate: localizedString({ max: 120, optional: true }),
  description: localizedString({ max: 300, optional: true }),
  ogImageUrl: optionalImage,
}).noUnknown(true, 'Unknown fields are not allowed');

export const settingsLocalesValidationSchema = Yup.object({
  enabledLocales: Yup.array()
    .of(
      Yup.string()
        .oneOf([...SUPPORTED_LOCALES], 'Unsupported locale')
        .required(),
    )
    .min(1)
    .required(),
}).noUnknown(true, 'Unknown fields are not allowed');
