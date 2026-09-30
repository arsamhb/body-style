import api from '@/lib/axiosInstance';
import type { LocalizedString } from '@/lib/i18n/types';
import { useMutation } from '@tanstack/react-query';
import { adminMediaReadResponse2MediaSchema } from './adapter.apiToLocal';
import type { AdminMediaUpdatePayload } from './interface.payload';
import type { MediaSchema } from './interface.schema';
import { ADMIN_MEDIA_ROUTE, getAdminMediaRouteById } from './route.api';

const usePostAdminMedia = (onSuccess?: (data: MediaSchema) => void) =>
  useMutation({
    mutationKey: ['post-admin-media'],
    mutationFn: ({ file, alt }: { file: File; alt?: LocalizedString }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (alt) formData.append('alt', JSON.stringify(alt));
      return api.postFormData<MediaSchema>(
        ADMIN_MEDIA_ROUTE,
        adminMediaReadResponse2MediaSchema
      )(formData);
    },
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminMediaById = (onSuccess?: (data: MediaSchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-media-by-id'],
    mutationFn: ({ id, payload }: { id: string; payload: AdminMediaUpdatePayload }) =>
      api.patch<AdminMediaUpdatePayload, MediaSchema>(
        getAdminMediaRouteById(id),
        (p) => p,
        adminMediaReadResponse2MediaSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const useDeleteAdminMediaById = (onSuccess?: () => void) =>
  useMutation({
    mutationKey: ['delete-admin-media-by-id'],
    mutationFn: ({ id }: { id: string }) => api.delete(getAdminMediaRouteById(id))(),
    onSuccess: () => onSuccess?.(),
  });

export { useDeleteAdminMediaById, usePatchAdminMediaById, usePostAdminMedia };
