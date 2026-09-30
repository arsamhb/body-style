import * as Yup from 'yup';
import { imageUrlSchema, localizedString } from '../../core/i18n/validation';
import { SECTION_TYPES } from './sections.types';

const sectionKeySchema = Yup.string()
  .max(60)
  .matches(/^[a-z0-9-]+$/, 'Key must be kebab-case');

export const pageSeoValidationSchema = Yup.object({
  title: localizedString({ max: 120, optional: true }),
  description: localizedString({ max: 300, optional: true }),
  ogImageUrl: imageUrlSchema.nullable().transform((v) => (v === null ? '' : v)),
}).noUnknown(true, 'Unknown fields are not allowed');

export const pageEnabledValidationSchema = Yup.object({
  enabled: Yup.boolean().required(),
}).noUnknown(true, 'Unknown fields are not allowed');

export const sectionCreateValidationSchema = Yup.object({
  type: Yup.string()
    .oneOf([...SECTION_TYPES])
    .required('type is required'),
  key: sectionKeySchema,
  // Kept opaque here (an empty Yup.object() would strip every key); the service validates it
  // against the schema of the section type.
  props: Yup.mixed(),
}).noUnknown(true, 'Unknown fields are not allowed');

export const sectionUpdateValidationSchema = Yup.object({
  enabled: Yup.boolean(),
  key: sectionKeySchema,
  props: Yup.mixed(),
}).noUnknown(true, 'Unknown fields are not allowed');

export const sectionsReorderValidationSchema = Yup.object({
  orderedIds: Yup.array().of(Yup.string().max(64).required()).min(1).required(),
}).noUnknown(true, 'Unknown fields are not allowed');
