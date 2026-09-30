import type { LocalizedString } from '@/lib/i18n/types';
import type {
  CardDesign,
  FilterConfig,
  ItemStatus,
  SpecDefinition,
  SpecValues,
} from '@/features/catalog/types';
import type { PaginationQuery } from '@/lib/pagination';

export interface AdminCatalogTypesWritePayload {
  slug?: string;
  name: LocalizedString;
  description: LocalizedString;
  specDefinitions: SpecDefinition[];
  cardDesign: CardDesign;
  filterConfig: FilterConfig;
  seo: { title: LocalizedString; description: LocalizedString };
  enabled: boolean;
}

export interface AdminCatalogCategoriesCreatePayload {
  typeId: string;
  slug?: string;
  name: LocalizedString;
}
export interface AdminCatalogCategoriesUpdatePayload {
  slug?: string;
  name: LocalizedString;
}

export interface AdminCatalogItemsWritePayload {
  typeId?: string;
  slug?: string;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  images: string[];
  categoryIds: string[];
  specs: SpecValues;
  featured: boolean;
  status: ItemStatus;
  seo: { title: LocalizedString; description: LocalizedString };
}

export interface AdminCatalogItemsStatusUpdatePayload {
  status: ItemStatus;
}

export interface AdminCatalogItemsPaginatedListReadQueryPayload extends PaginationQuery {
  typeId?: string;
  status?: ItemStatus;
  categoryId?: string;
  q?: string;
}
