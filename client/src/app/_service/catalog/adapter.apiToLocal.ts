import type {
  AdminCatalogCategoriesReadResponse,
  AdminCatalogItemsPaginatedListReadResponse,
  AdminCatalogItemsReadResponse,
  AdminCatalogTypesReadResponse,
} from './interface.response';
import type {
  CatalogCategoryListSchema,
  CatalogCategorySchema,
  CatalogItemPaginatedListSchema,
  CatalogItemSchema,
  CatalogTypeListSchema,
  CatalogTypeSchema,
} from './interface.schema';

export const adminCatalogTypesReadResponse2CatalogTypeSchema = (
  api: AdminCatalogTypesReadResponse
): CatalogTypeSchema => ({
  id: api.id,
  slug: api.slug,
  name: api.name ?? {},
  description: api.description ?? {},
  specDefinitions: (api.specDefinitions ?? []).map((d) => ({
    ...d,
    label: d.label ?? {},
    unit: d.unit ?? {},
    options: d.options ?? [],
  })),
  cardDesign: {
    variant: api.cardDesign?.variant ?? 'imageTop',
    imageRatio: api.cardDesign?.imageRatio ?? '4:3',
    showSummary: api.cardDesign?.showSummary ?? true,
    cardSpecKeys: api.cardDesign?.cardSpecKeys ?? [],
    badgeSpecKey: api.cardDesign?.badgeSpecKey ?? '',
    priceSpecKey: api.cardDesign?.priceSpecKey ?? '',
  },
  filterConfig: {
    categoriesEnabled: api.filterConfig?.categoriesEnabled ?? true,
    searchEnabled: api.filterConfig?.searchEnabled ?? true,
    enabledFilterKeys: api.filterConfig?.enabledFilterKeys ?? [],
    sortKeys: api.filterConfig?.sortKeys ?? [],
  },
  seo: { title: api.seo?.title ?? {}, description: api.seo?.description ?? {} },
  enabled: api.enabled,
  order: api.order,
  itemCount: api.itemCount ?? 0,
  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

export const adminCatalogTypesListReadResponse2CatalogTypeListSchema = (
  api: AdminCatalogTypesReadResponse[]
): CatalogTypeListSchema => api.map(adminCatalogTypesReadResponse2CatalogTypeSchema);

export const adminCatalogCategoriesReadResponse2CatalogCategorySchema = (
  api: AdminCatalogCategoriesReadResponse
): CatalogCategorySchema => ({
  id: api.id,
  typeId: api.typeId,
  slug: api.slug,
  name: api.name ?? {},
  order: api.order,
});

export const adminCatalogCategoriesListReadResponse2CatalogCategoryListSchema = (
  api: AdminCatalogCategoriesReadResponse[]
): CatalogCategoryListSchema => api.map(adminCatalogCategoriesReadResponse2CatalogCategorySchema);

export const adminCatalogItemsReadResponse2CatalogItemSchema = (
  api: AdminCatalogItemsReadResponse
): CatalogItemSchema => ({
  id: api.id,
  typeId: api.typeId,
  slug: api.slug,
  title: api.title ?? {},
  summary: api.summary ?? {},
  description: api.description ?? {},
  coverImage: api.coverImage ?? '',
  images: api.images ?? [],
  categoryIds: api.categoryIds ?? [],
  specs: api.specs ?? {},
  featured: api.featured,
  order: api.order,
  status: api.status,
  seo: { title: api.seo?.title ?? {}, description: api.seo?.description ?? {} },
  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

export const adminCatalogItemsPaginatedListReadResponse2CatalogItemPaginatedListSchema = (
  api: AdminCatalogItemsPaginatedListReadResponse
): CatalogItemPaginatedListSchema => ({
  data: api.data.map(adminCatalogItemsReadResponse2CatalogItemSchema),
  total: api.total,
  limit: api.limit,
  offset: api.offset,
  total_pages: api.total_pages,
});
