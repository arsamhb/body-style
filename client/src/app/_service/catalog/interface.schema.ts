import type { LocalizedString } from '@/lib/i18n/types';
import type { PaginatedMeta } from '@/lib/pagination';
import type {
  CardDesign,
  FilterConfig,
  ItemStatus,
  SpecDefinition,
  SpecValues,
} from '@/features/catalog/types';

export interface CatalogTypeSchema {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  specDefinitions: SpecDefinition[];
  cardDesign: CardDesign;
  filterConfig: FilterConfig;
  seo: { title: LocalizedString; description: LocalizedString };
  enabled: boolean;
  order: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}
export type CatalogTypeListSchema = CatalogTypeSchema[];

export interface CatalogCategorySchema {
  id: string;
  typeId: string;
  slug: string;
  name: LocalizedString;
  order: number;
}
export type CatalogCategoryListSchema = CatalogCategorySchema[];

export interface CatalogItemSchema {
  id: string;
  typeId: string;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  images: string[];
  categoryIds: string[];
  specs: SpecValues;
  featured: boolean;
  order: number;
  status: ItemStatus;
  seo: { title: LocalizedString; description: LocalizedString };
  createdAt: Date;
  updatedAt: Date;
}
export interface CatalogItemPaginatedListSchema extends PaginatedMeta {
  data: CatalogItemSchema[];
}
