import { LocalizedString } from '../../core/i18n/types';

/**
 * Catalog data model. A *type* ("Products", "Insurance plans", …) is designed by the developer:
 * which specs items have, which are filterable, and how the card looks. Admins then manage
 * categories and items of that type. Mirrored in `client/src/features/catalog/types.ts`.
 */
export const SPEC_TYPES = [
  'text',
  'number',
  'boolean',
  'select',
  'multiselect',
  'price',
  'url',
] as const;
export type SpecType = (typeof SPEC_TYPES)[number];

export const CARD_VARIANTS = [
  'imageTop',
  'imageStart',
  'overlay',
  'minimal',
] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

export const IMAGE_RATIOS = ['1:1', '4:3', '16:9', '3:4'] as const;
export type ImageRatio = (typeof IMAGE_RATIOS)[number];

export const ITEM_STATUSES = ['draft', 'published'] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const SPEC_KEY_REGEX = /^[a-z][a-zA-Z0-9_]{0,31}$/;

export interface SpecOption {
  value: string;
  label: LocalizedString;
}

export interface SpecDefinition {
  key: string;
  label: LocalizedString;
  type: SpecType;
  unit: LocalizedString;
  currency: string;
  options: SpecOption[];
  filterable: boolean;
  showOnCard: boolean;
  showOnDetail: boolean;
  required: boolean;
  order: number;
}

export interface CardDesign {
  variant: CardVariant;
  imageRatio: ImageRatio;
  showSummary: boolean;
  cardSpecKeys: string[];
  badgeSpecKey: string;
  priceSpecKey: string;
}

export interface FilterConfig {
  categoriesEnabled: boolean;
  searchEnabled: boolean;
  enabledFilterKeys: string[];
  sortKeys: string[];
}

export type SpecValue = string | number | boolean | string[];
export type SpecValues = Record<string, SpecValue>;

/** Sort keys that are always allowed besides the developer-enabled spec keys. */
export const BUILTIN_SORT_KEYS = ['order', 'createdAt', 'title'] as const;
