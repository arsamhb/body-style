import type { LocalizedString } from '@/lib/i18n/types';
import type {
  CardDesign,
  FilterConfig,
  ItemStatus,
  SpecDefinition,
} from '@/features/catalog/types';

export interface CatalogTypeFormSchema {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  specDefinitions: SpecDefinition[];
  cardDesign: CardDesign;
  filterConfig: FilterConfig;
  seo: { title: LocalizedString; description: LocalizedString };
  enabled: boolean;
}

export interface CatalogCategoryFormSchema {
  typeId: string;
  slug: string;
  name: LocalizedString;
}

/** Spec inputs are kept as the raw form value (strings for numbers) and coerced by the adapter. */
export interface CatalogItemFormSchema {
  typeId: string;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  images: string[];
  categoryIds: string[];
  specs: Record<string, unknown>;
  featured: boolean;
  status: ItemStatus;
  seo: { title: LocalizedString; description: LocalizedString };
}
