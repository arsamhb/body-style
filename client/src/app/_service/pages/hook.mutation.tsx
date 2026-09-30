import api from '@/lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { adminPagesReadResponse2PageSchema } from './adapter.apiToLocal';
import {
  pageSeoFormSchema2AdminPagesSeoUpdatePayload,
  sectionPropsFormSchema2AdminPagesSectionsUpdatePayload,
} from './adapter.localToApi';
import type { PageSeoFormSchema, SectionPropsFormSchema } from './interface.form';
import type {
  AdminPagesEnabledUpdatePayload,
  AdminPagesSectionsCreatePayload,
  AdminPagesSectionsReorderPayload,
  AdminPagesSectionsUpdatePayload,
} from './interface.payload';
import type { PageSchema } from './interface.schema';
import {
  getAdminPagesEnabledRouteByKey,
  getAdminPagesRouteByKey,
  getAdminPagesSectionsReorderRouteByKey,
  getAdminPagesSectionsRouteByKey,
  getAdminPagesSectionsRouteByKeyBySectionId,
} from './route.api';

type OnSuccess = (data: PageSchema) => void;
const id = <T,>(p: T) => p;

const usePatchAdminPagesByKey = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-pages-by-key'],
    mutationFn: ({ key, payload }: { key: string; payload: PageSeoFormSchema }) =>
      api.patch<PageSeoFormSchema, PageSchema>(
        getAdminPagesRouteByKey(key),
        pageSeoFormSchema2AdminPagesSeoUpdatePayload,
        adminPagesReadResponse2PageSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminPagesEnabledByKey = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-pages-enabled-by-key'],
    mutationFn: ({ key, payload }: { key: string; payload: AdminPagesEnabledUpdatePayload }) =>
      api.patch<AdminPagesEnabledUpdatePayload, PageSchema>(
        getAdminPagesEnabledRouteByKey(key),
        id,
        adminPagesReadResponse2PageSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePostAdminPagesSectionsByKey = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['post-admin-pages-sections-by-key'],
    mutationFn: ({ key, payload }: { key: string; payload: AdminPagesSectionsCreatePayload }) =>
      api.post<AdminPagesSectionsCreatePayload, PageSchema>(
        getAdminPagesSectionsRouteByKey(key),
        id,
        adminPagesReadResponse2PageSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

/** Toggle / rename: sends the raw partial payload. */
const usePatchAdminPagesSectionsByKeyBySectionId = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-pages-sections-by-key-by-section-id'],
    mutationFn: ({
      key,
      sectionId,
      payload,
    }: {
      key: string;
      sectionId: string;
      payload: AdminPagesSectionsUpdatePayload;
    }) =>
      api.patch<AdminPagesSectionsUpdatePayload, PageSchema>(
        getAdminPagesSectionsRouteByKeyBySectionId(key, sectionId),
        id,
        adminPagesReadResponse2PageSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

/** Props editor: sends the section editor form as `{ props }`. */
const usePatchAdminPagesSectionsPropsByKeyBySectionId = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-pages-sections-props-by-key-by-section-id'],
    mutationFn: ({
      key,
      sectionId,
      payload,
    }: {
      key: string;
      sectionId: string;
      payload: SectionPropsFormSchema;
    }) =>
      api.patch<SectionPropsFormSchema, PageSchema>(
        getAdminPagesSectionsRouteByKeyBySectionId(key, sectionId),
        sectionPropsFormSchema2AdminPagesSectionsUpdatePayload,
        adminPagesReadResponse2PageSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminPagesSectionsReorderByKey = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-pages-sections-reorder-by-key'],
    mutationFn: ({ key, payload }: { key: string; payload: AdminPagesSectionsReorderPayload }) =>
      api.patch<AdminPagesSectionsReorderPayload, PageSchema>(
        getAdminPagesSectionsReorderRouteByKey(key),
        id,
        adminPagesReadResponse2PageSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const useDeleteAdminPagesSectionsByKeyBySectionId = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['delete-admin-pages-sections-by-key-by-section-id'],
    mutationFn: async ({ key, sectionId }: { key: string; sectionId: string }) =>
      adminPagesReadResponse2PageSchema(
        await api.delete(getAdminPagesSectionsRouteByKeyBySectionId(key, sectionId))()
      ),
    onSuccess: (data) => onSuccess?.(data),
  });

export {
  useDeleteAdminPagesSectionsByKeyBySectionId,
  usePatchAdminPagesByKey,
  usePatchAdminPagesEnabledByKey,
  usePatchAdminPagesSectionsByKeyBySectionId,
  usePatchAdminPagesSectionsPropsByKeyBySectionId,
  usePatchAdminPagesSectionsReorderByKey,
  usePostAdminPagesSectionsByKey,
};
