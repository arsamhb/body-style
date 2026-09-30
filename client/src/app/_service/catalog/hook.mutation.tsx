import api from '@/lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import type { SpecDefinition } from '@/features/catalog/types';
import {
  adminCatalogCategoriesReadResponse2CatalogCategorySchema,
  adminCatalogItemsReadResponse2CatalogItemSchema,
  adminCatalogTypesReadResponse2CatalogTypeSchema,
} from './adapter.apiToLocal';
import {
  catalogCategoryFormSchema2AdminCatalogCategoriesCreatePayload,
  catalogCategoryFormSchema2AdminCatalogCategoriesUpdatePayload,
  catalogItemFormSchema2AdminCatalogItemsWritePayload,
  catalogTypeFormSchema2AdminCatalogTypesWritePayload,
} from './adapter.localToApi';
import type {
  CatalogCategoryFormSchema,
  CatalogItemFormSchema,
  CatalogTypeFormSchema,
} from './interface.form';
import type { AdminCatalogItemsStatusUpdatePayload } from './interface.payload';
import type {
  CatalogCategorySchema,
  CatalogItemSchema,
  CatalogTypeSchema,
} from './interface.schema';
import {
  ADMIN_CATALOG_CATEGORIES_ROUTE,
  ADMIN_CATALOG_ITEMS_ROUTE,
  ADMIN_CATALOG_TYPES_ROUTE,
  getAdminCatalogCategoriesRouteById,
  getAdminCatalogItemsRouteById,
  getAdminCatalogItemsStatusRouteById,
  getAdminCatalogTypesRouteById,
} from './route.api';

/* ---------- types ---------- */
const usePostAdminCatalogTypes = (onSuccess?: (d: CatalogTypeSchema) => void) =>
  useMutation({
    mutationKey: ['post-admin-catalog-types'],
    mutationFn: ({ payload }: { payload: CatalogTypeFormSchema }) =>
      api.post<CatalogTypeFormSchema, CatalogTypeSchema>(
        ADMIN_CATALOG_TYPES_ROUTE,
        catalogTypeFormSchema2AdminCatalogTypesWritePayload,
        adminCatalogTypesReadResponse2CatalogTypeSchema
      )(payload),
    onSuccess: (d) => onSuccess?.(d),
  });

const usePatchAdminCatalogTypesById = (onSuccess?: (d: CatalogTypeSchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-catalog-types-by-id'],
    mutationFn: ({ id, payload }: { id: string; payload: CatalogTypeFormSchema }) =>
      api.patch<CatalogTypeFormSchema, CatalogTypeSchema>(
        getAdminCatalogTypesRouteById(id),
        catalogTypeFormSchema2AdminCatalogTypesWritePayload,
        adminCatalogTypesReadResponse2CatalogTypeSchema
      )(payload),
    onSuccess: (d) => onSuccess?.(d),
  });

const useDeleteAdminCatalogTypesById = (onSuccess?: () => void) =>
  useMutation({
    mutationKey: ['delete-admin-catalog-types-by-id'],
    mutationFn: ({ id }: { id: string }) => api.delete(getAdminCatalogTypesRouteById(id))(),
    onSuccess: () => onSuccess?.(),
  });

/* ---------- categories ---------- */
const usePostAdminCatalogCategories = (onSuccess?: (d: CatalogCategorySchema) => void) =>
  useMutation({
    mutationKey: ['post-admin-catalog-categories'],
    mutationFn: ({ payload }: { payload: CatalogCategoryFormSchema }) =>
      api.post<CatalogCategoryFormSchema, CatalogCategorySchema>(
        ADMIN_CATALOG_CATEGORIES_ROUTE,
        catalogCategoryFormSchema2AdminCatalogCategoriesCreatePayload,
        adminCatalogCategoriesReadResponse2CatalogCategorySchema
      )(payload),
    onSuccess: (d) => onSuccess?.(d),
  });

const usePatchAdminCatalogCategoriesById = (onSuccess?: (d: CatalogCategorySchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-catalog-categories-by-id'],
    mutationFn: ({ id, payload }: { id: string; payload: CatalogCategoryFormSchema }) =>
      api.patch<CatalogCategoryFormSchema, CatalogCategorySchema>(
        getAdminCatalogCategoriesRouteById(id),
        catalogCategoryFormSchema2AdminCatalogCategoriesUpdatePayload,
        adminCatalogCategoriesReadResponse2CatalogCategorySchema
      )(payload),
    onSuccess: (d) => onSuccess?.(d),
  });

const useDeleteAdminCatalogCategoriesById = (onSuccess?: () => void) =>
  useMutation({
    mutationKey: ['delete-admin-catalog-categories-by-id'],
    mutationFn: ({ id }: { id: string }) => api.delete(getAdminCatalogCategoriesRouteById(id))(),
    onSuccess: () => onSuccess?.(),
  });

/* ---------- items ---------- */
const usePostAdminCatalogItems = (onSuccess?: (d: CatalogItemSchema) => void) =>
  useMutation({
    mutationKey: ['post-admin-catalog-items'],
    mutationFn: ({ payload, defs }: { payload: CatalogItemFormSchema; defs: SpecDefinition[] }) =>
      api.post<CatalogItemFormSchema, CatalogItemSchema>(
        ADMIN_CATALOG_ITEMS_ROUTE,
        (form) =>
          catalogItemFormSchema2AdminCatalogItemsWritePayload(form, defs, { isCreate: true }),
        adminCatalogItemsReadResponse2CatalogItemSchema
      )(payload),
    onSuccess: (d) => onSuccess?.(d),
  });

const usePatchAdminCatalogItemsById = (onSuccess?: (d: CatalogItemSchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-catalog-items-by-id'],
    mutationFn: ({
      id,
      payload,
      defs,
    }: {
      id: string;
      payload: CatalogItemFormSchema;
      defs: SpecDefinition[];
    }) =>
      api.patch<CatalogItemFormSchema, CatalogItemSchema>(
        getAdminCatalogItemsRouteById(id),
        (form) => catalogItemFormSchema2AdminCatalogItemsWritePayload(form, defs),
        adminCatalogItemsReadResponse2CatalogItemSchema
      )(payload),
    onSuccess: (d) => onSuccess?.(d),
  });

const usePatchAdminCatalogItemsStatusById = (onSuccess?: (d: CatalogItemSchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-catalog-items-status-by-id'],
    mutationFn: ({ id, payload }: { id: string; payload: AdminCatalogItemsStatusUpdatePayload }) =>
      api.patch<AdminCatalogItemsStatusUpdatePayload, CatalogItemSchema>(
        getAdminCatalogItemsStatusRouteById(id),
        (p) => p,
        adminCatalogItemsReadResponse2CatalogItemSchema
      )(payload),
    onSuccess: (d) => onSuccess?.(d),
  });

const useDeleteAdminCatalogItemsById = (onSuccess?: () => void) =>
  useMutation({
    mutationKey: ['delete-admin-catalog-items-by-id'],
    mutationFn: ({ id }: { id: string }) => api.delete(getAdminCatalogItemsRouteById(id))(),
    onSuccess: () => onSuccess?.(),
  });

export {
  useDeleteAdminCatalogCategoriesById,
  useDeleteAdminCatalogItemsById,
  useDeleteAdminCatalogTypesById,
  usePatchAdminCatalogCategoriesById,
  usePatchAdminCatalogItemsById,
  usePatchAdminCatalogItemsStatusById,
  usePatchAdminCatalogTypesById,
  usePostAdminCatalogCategories,
  usePostAdminCatalogItems,
  usePostAdminCatalogTypes,
};
