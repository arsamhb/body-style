import { LocalizedString } from '../../core/i18n/types';
import {
  CardDesign,
  FilterConfig,
  ItemStatus,
  SpecDefinition,
  SpecValues,
} from './catalog.types';

export type SpecDefinitionPayload = Omit<
  SpecDefinition,
  'unit' | 'currency' | 'options' | 'order'
> &
  Partial<Pick<SpecDefinition, 'unit' | 'currency' | 'options' | 'order'>>;

export interface CatalogTypeCreatePayload {
  slug?: string;
  name: LocalizedString;
  description?: LocalizedString;
  specDefinitions?: SpecDefinitionPayload[];
  cardDesign?: Partial<CardDesign>;
  filterConfig?: Partial<FilterConfig>;
  seo?: { title?: LocalizedString; description?: LocalizedString };
  enabled?: boolean;
  order?: number;
}

export type CatalogTypeUpdatePayload = Partial<CatalogTypeCreatePayload>;

export interface CatalogCategoryCreatePayload {
  typeId: string;
  slug?: string;
  name: LocalizedString;
  order?: number;
}

export type CatalogCategoryUpdatePayload = Partial<
  Omit<CatalogCategoryCreatePayload, 'typeId'>
>;

export interface CatalogItemCreatePayload {
  typeId: string;
  slug?: string;
  title: LocalizedString;
  summary?: LocalizedString;
  description?: LocalizedString;
  coverImage?: string;
  images?: string[];
  categoryIds?: string[];
  specs?: SpecValues;
  featured?: boolean;
  order?: number;
  status?: ItemStatus;
  seo?: { title?: LocalizedString; description?: LocalizedString };
}

export type CatalogItemUpdatePayload = Partial<
  Omit<CatalogItemCreatePayload, 'typeId'>
>;

export interface CatalogItemStatusUpdatePayload {
  status: ItemStatus;
}

export interface PublicItemsQuery {
  category?: string;
  q?: string;
  sort?: string;
  [key: string]: unknown;
}
