import api from '@/lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { authTokenPairResponse2AuthTokenPairSchema } from './adapter.apiToLocal';
import {
  authLoginFormSchema2AuthLoginCreatePayload,
  authPasswordFormSchema2AuthPasswordCreatePayload,
} from './adapter.localToApi';
import type { AuthLoginFormSchema, AuthPasswordFormSchema } from './interface.form';
import type { AuthLogoutCreatePayload } from './interface.payload';
import type { SuccessResponse } from './interface.response';
import type { AuthTokenPairSchema } from './interface.schema';
import { AUTH_LOGIN_ROUTE, AUTH_LOGOUT_ROUTE, AUTH_PASSWORD_ROUTE } from './route.api';

const usePostAuthLogin = (onSuccess: (data: AuthTokenPairSchema) => void) =>
  useMutation({
    mutationKey: ['post-auth-login'],
    mutationFn: ({ payload }: { payload: AuthLoginFormSchema }) =>
      api.post<AuthLoginFormSchema, AuthTokenPairSchema>(
        AUTH_LOGIN_ROUTE,
        authLoginFormSchema2AuthLoginCreatePayload,
        authTokenPairResponse2AuthTokenPairSchema
      )(payload),
    onSuccess: (data) => onSuccess(data),
  });

const usePostAuthLogout = (onSettled?: () => void) =>
  useMutation({
    mutationKey: ['post-auth-logout'],
    mutationFn: ({ payload }: { payload: AuthLogoutCreatePayload }) =>
      api.post<AuthLogoutCreatePayload, SuccessResponse>(AUTH_LOGOUT_ROUTE)(payload),
    onSettled: () => onSettled?.(),
  });

const usePostAuthPassword = (onSuccess?: () => void) =>
  useMutation({
    mutationKey: ['post-auth-password'],
    mutationFn: ({ payload }: { payload: AuthPasswordFormSchema }) =>
      api.post<AuthPasswordFormSchema, SuccessResponse>(
        AUTH_PASSWORD_ROUTE,
        authPasswordFormSchema2AuthPasswordCreatePayload
      )(payload),
    onSuccess: () => onSuccess?.(),
  });

export { usePostAuthLogin, usePostAuthLogout, usePostAuthPassword };
