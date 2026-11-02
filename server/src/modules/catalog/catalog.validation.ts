import * as Yup from 'yup';
import { imageUrlSchema, localizedString } from '../../core/i18n/validation';
import {
  CARD_VARIANTS,
  IMAGE_RATIOS,
  ITEM_STATUSES,
  SPEC_KEY_REGEX,
  SPEC_TYPES,
} from './catalog.types';

const noUnknown = <T extends Yup.AnyObject>(s: Yup.ObjectSchema<T>) =>
  s.noUnknown(true, 'Unknown fields are not allowed');
/** Same, but a missing object stays undefined instead of being built from field defaults. */
const noUnknownDefaultless = <T extends Yup.AnyObject>(
  s: Yup.ObjectSchema<T>,
) => s.noUnknown(true, 'Unknown fields are not allowed').default(undefined);
const slugSchema = Yup.string()
  .max(80)
  .matches(/^[\p{L}\p{N}-]+$/u, {
    message: 'Invalid slug',
    excludeEmptyString: true,
  });
const objectId = Yup.string().matches(/^[a-f\d]{24}$/i, 'Invalid id');

const specOptionSchema = noUnknown(
  Yup.object({
    value: Yup.string()
      .trim()
      .max(60)
      .matches(/^[^\s,]+$/, 'Option values cannot contain spaces or commas')
      .required(),
    label: localizedString({ required: true, max: 60 }),
  }),
);

export const specDefinitionSchema = noUnknown(
  Yup.object({
    key: Yup.string()
      .matches(SPEC_KEY_REGEX, 'Key must be camelCase letters/digits (max 32)')
      .required(),
    label: localizedString({ required: true, max: 60 }),
    type: Yup.string()
      .oneOf([...SPEC_TYPES])
      .required(),
    unit: localizedString({ max: 20 }),
    currency: Yup.string().max(20).default(''),
    options: Yup.array().of(specOptionSchema).max(50).default([]),
    filterable: Yup.boolean().default(false),
    showOnCard: Yup.boolean().default(false),
    showOnDetail: Yup.boolean().default(true),
    required: Yup.boolean().default(false),
    order: Yup.number().integer().min(0).default(0),
  }).test(
    'options-for-select',
    'select/multiselect specs need at least one option',
    (d) =>
      d.type === 'select' || d.type === 'multiselect'
        ? (d.options?.length ?? 0) > 0
        : true,
  ),
);

const cardDesignSchema = noUnknownDefaultless(
  Yup.object({
    variant: Yup.string().oneOf([...CARD_VARIANTS]),
    imageRatio: Yup.string().oneOf([...IMAGE_RATIOS]),
    showSummary: Yup.boolean(),
    cardSpecKeys: Yup.array()
      .of(Yup.string().matches(SPEC_KEY_REGEX).required())
      .max(4),
    badgeSpecKey: Yup.string().matches(SPEC_KEY_REGEX, {
      excludeEmptyString: true,
    }),
    priceSpecKey: Yup.string().matches(SPEC_KEY_REGEX, {
      excludeEmptyString: true,
    }),
  }),
);

const filterConfigSchema = noUnknownDefaultless(
  Yup.object({
    categoriesEnabled: Yup.boolean(),
    searchEnabled: Yup.boolean(),
    enabledFilterKeys: Yup.array()
      .of(Yup.string().matches(SPEC_KEY_REGEX).required())
      .max(20),
    sortKeys: Yup.array()
      .of(Yup.string().matches(SPEC_KEY_REGEX).required())
      .max(10),
  }),
);

const seoSchema = noUnknown(
  Yup.object({
    title: localizedString({ max: 120 }),
    description: localizedString({ max: 300 }),
  }),
);

const typeShape = {
  slug: slugSchema,
  name: localizedString({ required: true, max: 80, optional: true }),
  description: localizedString({ max: 1000, optional: true }),
  specDefinitions: Yup.array()
    .of(specDefinitionSchema)
    .max(40)
    .test('unique-keys', 'Spec keys must be unique', (defs) => {
      const keys = (defs ?? []).map((d) => d.key);
      return new Set(keys).size === keys.length;
    }),
  cardDesign: cardDesignSchema,
  filterConfig: filterConfigSchema,
  seo: seoSchema,
  enabled: Yup.boolean(),
  order: Yup.number().integer().min(0),
};

// Create: the name is mandatory (the shared shape is optional so PATCH can omit it).
export const catalogTypeCreateValidationSchema = noUnknown(
  Yup.object({
    ...typeShape,
    name: localizedString({ required: true, max: 80 }),
  }),
);
export const catalogTypeUpdateValidationSchema = noUnknown(
  Yup.object({
    ...typeShape,
    name: localizedString({ max: 80, optional: true }),
  }),
);

export const catalogCategoryCreateValidationSchema = noUnknown(
  Yup.object({
    typeId: objectId.required('typeId is required'),
    slug: slugSchema,
    parentId: objectId.nullable(),
    name: localizedString({ required: true, max: 80 }),
    order: Yup.number().integer().min(0),
  }),
);
export const catalogCategoryUpdateValidationSchema = noUnknown(
  Yup.object({
    slug: slugSchema,
    parentId: objectId.nullable(),
    name: localizedString({ max: 80 }),
    order: Yup.number().integer().min(0),
  }),
);

const itemShape = {
  slug: slugSchema,
  title: localizedString({ required: true, max: 160, optional: true }),
  summary: localizedString({ max: 300, optional: true }),
  description: localizedString({ max: 8000, optional: true }),
  coverImage: imageUrlSchema.nullable().transform((v) => (v === null ? '' : v)),
  images: Yup.array().of(imageUrlSchema.required()).max(12),
  categoryIds: Yup.array().of(objectId.required()).max(20),
  // Validated against the type's spec definitions in the service.
  specs: Yup.mixed(),
  featured: Yup.boolean(),
  order: Yup.number().integer().min(0),
  status: Yup.string().oneOf([...ITEM_STATUSES]),
  seo: seoSchema,
};

export const catalogItemCreateValidationSchema = noUnknown(
  Yup.object({
    typeId: objectId.required('typeId is required'),
    ...itemShape,
    title: localizedString({ required: true, max: 160 }),
  }),
);
export const catalogItemUpdateValidationSchema = noUnknown(
  Yup.object({ ...itemShape, title: localizedString({ max: 160 }) }),
);
export const catalogItemStatusValidationSchema = noUnknown(
  Yup.object({
    status: Yup.string()
      .oneOf([...ITEM_STATUSES])
      .required(),
  }),
);
