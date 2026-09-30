import api from '@/lib/axiosInstance';
import { buildPaginationQueryParams, DEFAULT_OFFSET } from '@/lib/pagination';
import { useQuery } from '@tanstack/react-query';
import {
  adminCatalogCategoriesListReadResponse2CatalogCategoryListSchema,
  adminCatalogItemsPaginatedListReadResponse2CatalogItemPaginatedListSchema,
  adminCatalogItemsReadResponse2CatalogItemSchema,
  adminCatalogTypesListReadResponse2CatalogTypeListSchema,
  adminCatalogTypesReadResponse2CatalogTypeSchema,
} from './adapter.apiToLocal';
import type { AdminCatalogItemsPaginatedListReadQueryPayload } from './interface.payload';
import type {
  CatalogCategoryListSchema,
  CatalogItemPaginatedListSchema,
  CatalogItemSchema,
  CatalogTypeListSchema,
  CatalogTypeSchema,
} from './interface.schema';
import {
  ADMIN_CATALOG_CATEGORIES_ROUTE,
  ADMIN_CATALOG_ITEMS_ROUTE,
  ADMIN_CATALOG_TYPES_ROUTE,
  getAdminCatalogItemsRouteById,
  getAdminCatalogTypesRouteById,
} from './route.api';

interface QueryHookOptions {
  enabled?: boolean;
}

export const ADMIN_CATALOG_TYPES_LIST_QUERY_KEY = ['get-admin-catalog-types-list'] as const;
export const ADMIN_CATALOG_CATEGORIES_LIST_QUERY_KEY = 'get-admin-catalog-categories-list';
export const ADMIN_CATALOG_ITEMS_LIST_QUERY_KEY = 'get-admin-catalog-items-paginated-list';

const useGetAdminCatalogTypesList = ({ options }: { options?: QueryHookOptions } = {}) =>
  useQuery({
    queryKey: ADMIN_CATALOG_TYPES_LIST_QUERY_KEY,
    queryFn: api.get<CatalogTypeListSchema>(
      ADMIN_CATALOG_TYPES_ROUTE,
      adminCatalogTypesListReadResponse2CatalogTypeListSchema
    ),
    enabled: options?.enabled ?? true,
  });

const useGetAdminCatalogTypesById = ({ id, options }: { id: string; options?: QueryHookOptions }) =>
  useQuery({
    queryKey: ['get-admin-catalog-types-by-id', id],
    queryFn: api.get<CatalogTypeSchema>(
      getAdminCatalogTypesRouteById(id),
      adminCatalogTypesReadResponse2CatalogTypeSchema
    ),
    enabled: options?.enabled ?? true,
  });

const useGetAdminCatalogCategoriesList = ({
  typeId,
  options,
}: { typeId?: string; options?: QueryHookOptions } = {}) =>
  useQuery({
    queryKey: [ADMIN_CATALOG_CATEGORIES_LIST_QUERY_KEY, typeId ?? 'all'],
    queryFn: api.get<CatalogCategoryListSchema>(
      ADMIN_CATALOG_CATEGORIES_ROUTE,
      adminCatalogCategoriesListReadResponse2CatalogCategoryListSchema,
      typeId ? { typeId } : {}
    ),
    enabled: options?.enabled ?? true,
  });

const useGetAdminCatalogItemsPaginatedList = ({
  query,
  options,
}: { query?: AdminCatalogItemsPaginatedListReadQueryPayload; options?: QueryHookOptions } = {}) => {
  const queryParams = buildPaginationQueryParams({
    limit: query?.limit ?? 20,
    offset: query?.offset ?? DEFAULT_OFFSET,
    typeId: query?.typeId,
    status: query?.status,
    categoryId: query?.categoryId,
    q: query?.q,
  });
  return useQuery({
    queryKey: [ADMIN_CATALOG_ITEMS_LIST_QUERY_KEY, queryParams],
    queryFn: api.get<CatalogItemPaginatedListSchema>(
      ADMIN_CATALOG_ITEMS_ROUTE,
      adminCatalogItemsPaginatedListReadResponse2CatalogItemPaginatedListSchema,
      queryParams
    ),
    enabled: options?.enabled ?? true,
  });
};

const useGetAdminCatalogItemsById = ({ id, options }: { id: string; options?: QueryHookOptions }) =>
  useQuery({
    queryKey: ['get-admin-catalog-items-by-id', id],
    queryFn: api.get<CatalogItemSchema>(
      getAdminCatalogItemsRouteById(id),
      adminCatalogItemsReadResponse2CatalogItemSchema
    ),
    enabled: options?.enabled ?? true,
  });

export {
  useGetAdminCatalogCategoriesList,
  useGetAdminCatalogItemsById,
  useGetAdminCatalogItemsPaginatedList,
  useGetAdminCatalogTypesById,
  useGetAdminCatalogTypesList,
};
