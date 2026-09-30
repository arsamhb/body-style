import axios, { AxiosError } from 'axios';
import { parseApiErrorFromBody, toApiError, UNKNOWN_API_ERROR, type ApiError } from './api/errors';
import authService from './auth/authService';
import { AUTH_LOGIN_ROUTE, AUTH_REFRESH_ROUTE } from '@/app/_service/auth/route.api';

/** @deprecated Use UNKNOWN_API_ERROR from @/lib/api/errors */
export const UNKNOWN_ERROR = {
  message: UNKNOWN_API_ERROR.message,
  statusCode: UNKNOWN_API_ERROR.status,
};

const rejectAsApiError = (error: AxiosError): Promise<ApiError> => {
  const status = error.response?.status ?? 0;
  const apiError = error.response?.data
    ? parseApiErrorFromBody(status, error.response.data)
    : toApiError(error);
  return Promise.reject(apiError);
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export let isRefreshing = false;
export const setIsRefreshing = (val: boolean) => {
  isRefreshing = val;
};
export let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];
export const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)));
  failedQueue = [];
};
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      // A 401 from login/refresh is a credential failure, not an expired session.
      !originalRequest.url?.includes(AUTH_REFRESH_ROUTE) &&
      !originalRequest.url?.includes(AUTH_LOGIN_ROUTE)
    ) {
      const refreshToken = authService.getRefreshToken();

      if (!refreshToken) {
        window.dispatchEvent(new Event('auth:error'));
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${(process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '')}${AUTH_REFRESH_ROUTE}`,
          {
            refreshToken,
          }
        );

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken ?? refreshToken;

        authService.setSession(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authService.clearSession();
        window.dispatchEvent(new Event('auth:error'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return rejectAsApiError(error);
  }
);

const post = <T, O>(
  url: string,
  local2api: (local: T) => any = (local: T) => local,
  api2local: (api: any) => O = (api: any) => api
) => {
  return async (body: T) => {
    try {
      const response = await instance.post(url, local2api(body));
      return api2local(response.data) as O;
    } catch (e) {
      return Promise.reject(toApiError(e));
    }
  };
};

const get = <O>(url: string, api2local: (api: any) => O = (api) => api, queryParams: any = {}) => {
  return async () => {
    try {
      const response = await instance.get(url, { params: queryParams });
      return api2local(response.data) as O;
    } catch (e) {
      return Promise.reject(toApiError(e));
    }
  };
};

const _delete = (url: string) => {
  return async () => {
    try {
      const response = await instance.delete(url);
      return response.data;
    } catch (e) {
      return Promise.reject(toApiError(e));
    }
  };
};

const put = <T, O>(
  url: string,
  local2api: (local: T) => any = (local: T) => local,
  api2local: (api: any) => O = (api: any) => api
) => {
  return async (body: T) => {
    try {
      const response = await instance.put(url, local2api(body));
      return api2local(response.data) as O;
    } catch (e) {
      return Promise.reject(toApiError(e));
    }
  };
};

const patch = <T, O>(
  url: string,
  local2api: (local: T) => any = (local: T) => local,
  api2local: (api: any) => O = (api: any) => api
) => {
  return async (body: T) => {
    try {
      const response = await instance.patch(url, local2api(body));
      return api2local(response.data) as O;
    } catch (e) {
      return Promise.reject(toApiError(e));
    }
  };
};

// THIS API METHOD HAS NO TIMEOUT
const postFormData = <O>(url: string, api2local: (api: any) => O = (api: any) => api) => {
  return async (formData: FormData): Promise<O> => {
    try {
      const response = await instance.post(url, formData, { timeout: 0 });
      return api2local(response.data) as O;
    } catch (e) {
      return Promise.reject(toApiError(e));
    }
  };
};

const api = {
  get,
  post,
  patch,
  delete: _delete,
  put,
  postFormData,
};

export default api;
