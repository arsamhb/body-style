import type { SpecDefinition, SpecOption } from '@/features/catalog/types';
import type {
  CatalogCategoryFormSchema,
  CatalogItemFormSchema,
  CatalogTypeFormSchema,
} from './interface.form';
import type {
  CatalogCategorySchema,
  CatalogItemSchema,
  CatalogTypeSchema,
} from './interface.schema';

export const getSpecOptionInitialValue = (): SpecOption => ({ value: '', label: {} });

export const getSpecDefinitionInitialValue = (): SpecDefinition => ({
  key: '',
  label: {},
  type: 'text',
  unit: {},
  currency: '',
  options: [],
  filterable: false,
  showOnCard: false,
  showOnDetail: true,
  required: false,
  order: 0,
});

export const getCatalogTypeFormInitialValue = (
  type?: CatalogTypeSchema
): CatalogTypeFormSchema => ({
  slug: type?.slug ?? '',
  name: type?.name ?? {},
  description: type?.description ?? {},
  specDefinitions: type?.specDefinitions ?? [],
  cardDesign: type?.cardDesign ?? {
    variant: 'imageTop',
    imageRatio: '4:3',
    showSummary: true,
    cardSpecKeys: [],
    badgeSpecKey: '',
    priceSpecKey: '',
  },
  filterConfig: type?.filterConfig ?? {
    categoriesEnabled: true,
    searchEnabled: true,
    enabledFilterKeys: [],
    sortKeys: [],
  },
  seo: type?.seo ?? { title: {}, description: {} },
  enabled: type?.enabled ?? true,
});

export const getCatalogCategoryFormInitialValue = (
  category?: CatalogCategorySchema,
  typeId = ''
): CatalogCategoryFormSchema => ({
  typeId: category?.typeId ?? typeId,
  slug: category?.slug ?? '',
  name: category?.name ?? {},
});

/** Specs are copied as-is; the editor renders them by definition and the adapter coerces back. */
export const getCatalogItemFormInitialValue = (
  item?: CatalogItemSchema,
  typeId = ''
): CatalogItemFormSchema => ({
  typeId: item?.typeId ?? typeId,
  slug: item?.slug ?? '',
  title: item?.title ?? {},
  summary: item?.summary ?? {},
  description: item?.description ?? {},
  coverImage: item?.coverImage ?? '',
  images: item?.images ?? [],
  categoryIds: item?.categoryIds ?? [],
  specs: { ...(item?.specs ?? {}) },
  featured: item?.featured ?? false,
  status: item?.status ?? 'draft',
  seo: item?.seo ?? { title: {}, description: {} },
});
