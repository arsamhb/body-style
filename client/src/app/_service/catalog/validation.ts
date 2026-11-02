import * as Yup from 'yup';
import {
  CARD_VARIANTS,
  IMAGE_RATIOS,
  ITEM_STATUSES,
  SPEC_KEY_REGEX,
  SPEC_TYPES,
} from '@/features/catalog/types';
import { localizedString } from '../settings/validation';

const slug = Yup.string()
  .trim()
  .matches(/^[\p{L}\p{N}-]*$/u, 'validation.slug');

const specOptionSchema = Yup.object({
  value: Yup.string()
    .trim()
    .matches(/^[^\s,]+$/, 'validation.optionValue')
    .required('validation.required'),
  label: localizedString({ required: true, max: 60 }),
});

const specDefinitionSchema = Yup.object({
  key: Yup.string().matches(SPEC_KEY_REGEX, 'validation.specKey').required('validation.required'),
  label: localizedString({ required: true, max: 60 }),
  type: Yup.string()
    .oneOf([...SPEC_TYPES])
    .required(),
  unit: localizedString({ max: 20 }),
  currency: Yup.string().max(20),
  options: Yup.array()
    .of(specOptionSchema)
    .when('type', {
      is: (t: string) => t === 'select' || t === 'multiselect',
      then: (s) => s.min(1, 'validation.optionsRequired'),
    }),
  filterable: Yup.boolean(),
  showOnCard: Yup.boolean(),
  showOnDetail: Yup.boolean(),
  required: Yup.boolean(),
});

export const catalogTypeValidationSchema = Yup.object({
  slug,
  name: localizedString({ required: true, max: 80 }),
  description: localizedString({ max: 1000 }),
  specDefinitions: Yup.array()
    .of(specDefinitionSchema)
    .test('unique-keys', 'validation.specKeysUnique', (defs) => {
      const keys = (defs ?? []).map((d) => d.key);
      return new Set(keys).size === keys.length;
    }),
  cardDesign: Yup.object({
    variant: Yup.string().oneOf([...CARD_VARIANTS]),
    imageRatio: Yup.string().oneOf([...IMAGE_RATIOS]),
    showSummary: Yup.boolean(),
    cardSpecKeys: Yup.array().of(Yup.string().required()).max(4, 'validation.maxCardSpecs'),
    badgeSpecKey: Yup.string(),
    priceSpecKey: Yup.string(),
  }),
  filterConfig: Yup.object({
    categoriesEnabled: Yup.boolean(),
    searchEnabled: Yup.boolean(),
    enabledFilterKeys: Yup.array().of(Yup.string().required()),
    sortKeys: Yup.array().of(Yup.string().required()),
  }),
  enabled: Yup.boolean(),
});

export const catalogCategoryValidationSchema = Yup.object({
  typeId: Yup.string().required('validation.required'),
  slug,
  parentId: Yup.string(),
  name: localizedString({ required: true, max: 80 }),
});

export const catalogItemValidationSchema = Yup.object({
  typeId: Yup.string().required('validation.required'),
  slug,
  title: localizedString({ required: true, max: 160 }),
  summary: localizedString({ max: 300 }),
  description: localizedString({ max: 8000 }),
  coverImage: Yup.string(),
  images: Yup.array().of(Yup.string()),
  categoryIds: Yup.array().of(Yup.string()),
  featured: Yup.boolean(),
  status: Yup.string().oneOf([...ITEM_STATUSES]),
});
