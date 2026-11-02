import type { LocalizedString } from '@/lib/i18n/types';
import type {
  CardDesign,
  FilterConfig,
  ItemStatus,
  SpecDefinition,
  SpecValues,
} from '@/features/catalog/types';
import type { PaginatedResponse } from '../interface.response';

export interface AdminCatalogTypesReadResponse {
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
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogCategoriesReadResponse {
  id: string;
  typeId: string;
  slug: string;
  parentId?: string | null;
  name: LocalizedString;
  order: number;
}

export interface AdminCatalogItemsReadResponse {
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
  createdAt: string;
  updatedAt: string;
}

export type AdminCatalogItemsPaginatedListReadResponse =
  PaginatedResponse<AdminCatalogItemsReadResponse>;
