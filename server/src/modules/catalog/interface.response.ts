import { LocalizedString } from '../../core/i18n/types';
import {
  CardDesign,
  FilterConfig,
  ItemStatus,
  SpecDefinition,
  SpecType,
  SpecValue,
  SpecValues,
} from './catalog.types';

/* ---------- admin (full maps) ---------- */

export interface CatalogTypeAdminResponse {
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

export interface CatalogCategoryAdminResponse {
  id: string;
  typeId: string;
  slug: string;
  parentId: string | null;
  name: LocalizedString;
  order: number;
}

export interface CatalogItemAdminResponse {
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
  /** Id of the parent category; null for a top-level one. */
  parentId: string | null;
  /** Published items in this category (a parent counts its children's items too). */
  itemCount: number;
}

export interface CatalogTypePublicSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  itemCount: number;
}

export interface CatalogTypePublicResponse extends CatalogTypePublicSummary {
  categories: PublicCatalogCategory[];
  filters: PublicFilterDefinition[];
  categoriesEnabled: boolean;
  searchEnabled: boolean;
  sortKeys: string[];
  /** Labels for `sortKeys` (they need not be filterable). */
  sortSpecs: PublicFilterDefinition[];
  cardDesign: CardDesign;
  seo: { title: string; description: string };
}

/** A resolved spec ready to render: raw typed value + display metadata. */
export interface PublicSpec {
  key: string;
  label: string;
  type: SpecType;
  unit: string;
  currency: string;
  value: SpecValue;
  /** Option label(s) for select/multiselect. */
  valueLabel?: string;
}

export interface CatalogItemCardResponse {
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

export interface CatalogItemPublicResponse extends CatalogItemCardResponse {
  description: string;
  images: string[];
  specs: PublicSpec[];
  seo: { title: string; description: string };
  type: { slug: string; name: string; href: string };
}
