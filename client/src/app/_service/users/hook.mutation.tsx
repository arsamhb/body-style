import api from '@/lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { adminUsersReadResponse2UserSchema } from './adapter.apiToLocal';
import {
  userFormSchema2AdminUsersCreatePayload,
  userFormSchema2AdminUsersUpdatePayload,
} from './adapter.localToApi';
import type { UserFormSchema } from './interface.form';
import type { UserSchema } from './interface.schema';
import { ADMIN_USERS_ROUTE, getAdminUsersRouteById } from './route.api';

const usePostAdminUsers = (onSuccess?: (data: UserSchema) => void) =>
  useMutation({
    mutationKey: ['post-admin-users'],
    mutationFn: ({ payload }: { payload: UserFormSchema }) =>
      api.post<UserFormSchema, UserSchema>(
        ADMIN_USERS_ROUTE,
        userFormSchema2AdminUsersCreatePayload,
        adminUsersReadResponse2UserSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminUsersById = (onSuccess?: (data: UserSchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-users-by-id'],
    mutationFn: ({
      id,
      payload,
      isSelf,
    }: {
      id: string;
      payload: UserFormSchema;
      isSelf?: boolean;
    }) =>
      api.patch<UserFormSchema, UserSchema>(
        getAdminUsersRouteById(id),
        (form) => userFormSchema2AdminUsersUpdatePayload(form, { isSelf }),
        adminUsersReadResponse2UserSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminUsersActiveById = (onSuccess?: (data: UserSchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-users-active-by-id'],
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch<{ isActive: boolean }, UserSchema>(
        getAdminUsersRouteById(id),
        (p) => p,
        adminUsersReadResponse2UserSchema
      )({ isActive }),
    onSuccess: (data) => onSuccess?.(data),
  });

const useDeleteAdminUsersById = (onSuccess?: () => void) =>
  useMutation({
    mutationKey: ['delete-admin-users-by-id'],
    mutationFn: ({ id }: { id: string }) => api.delete(getAdminUsersRouteById(id))(),
    onSuccess: () => onSuccess?.(),
  });

export {
  useDeleteAdminUsersById,
  usePatchAdminUsersActiveById,
  usePatchAdminUsersById,
  usePostAdminUsers,
};
