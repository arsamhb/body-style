import type { LocalizedString } from '@/lib/i18n/types';

/** Mirror of `server/src/modules/catalog/catalog.types.ts` + the public/admin response shapes. */
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

export const CARD_VARIANTS = ['imageTop', 'imageStart', 'overlay', 'minimal'] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

export const IMAGE_RATIOS = ['1:1', '4:3', '16:9', '3:4'] as const;
export type ImageRatio = (typeof IMAGE_RATIOS)[number];

export const ITEM_STATUSES = ['draft', 'published'] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const SPEC_KEY_REGEX = /^[a-z][a-zA-Z0-9_]{0,31}$/;

export type SpecValue = string | number | boolean | string[];
export type SpecValues = Record<string, SpecValue>;

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

/* ---------- public (resolved) ---------- */

export interface PublicSpecOption {
  value: string;
  label: string;
}

export interface PublicFilterDefinition {
  key: string;
  label: string;
  type: SpecType;
  unit: string;
  currency: string;
  options: PublicSpecOption[];
}

export interface PublicCatalogCategory {
  id: string;
  slug: string;
  name: string;
}

export interface CatalogTypeSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  itemCount: number;
}

export interface CatalogTypePublic extends CatalogTypeSummary {
  categories: PublicCatalogCategory[];
  filters: PublicFilterDefinition[];
  categoriesEnabled: boolean;
  searchEnabled: boolean;
  sortKeys: string[];
  sortSpecs: PublicFilterDefinition[];
  cardDesign: CardDesign;
  seo: { title: string; description: string };
}

export interface PublicSpec {
  key: string;
  label: string;
  type: SpecType;
  unit: string;
  currency: string;
  value: SpecValue;
  valueLabel?: string;
}

export interface CatalogItemCard {
  id: string;
  slug: string;
  href: string;
  title: string;
  summary: string;
  coverImage?: string;
  featured: boolean;
  categories: PublicCatalogCategory[];
  badge?: PublicSpec;
  price?: PublicSpec;
  cardSpecs: PublicSpec[];
}

export interface CatalogItemDetail extends CatalogItemCard {
  description: string;
  images: string[];
  specs: PublicSpec[];
  seo: { title: string; description: string };
  type: { slug: string; name: string; href: string };
}

export interface CatalogItemsPage {
  data: CatalogItemCard[];
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
}
