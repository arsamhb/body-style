import { notify } from '@/lib/notification/notificationService';
import { ApiError, isApiError, toApiError } from './errors';

export type HandleApiErrorOptions = {
  /** Skip toast (e.g. caller shows inline field errors only). */
  suppressToast?: boolean;
};

const AUTH_CODES_SKIP_TOAST = new Set([
  'NOT_AUTHENTICATED',
  'EXPIRED_TOKEN',
  'INVALID_CREDENTIALS',
]);

function shouldToast(apiError: ApiError, options?: HandleApiErrorOptions): boolean {
  if (options?.suppressToast) return false;
  if (apiError.status === 401) return false;

  if (apiError.code === 'VALIDATION_ERROR' && apiError.details?.length) {
    return false;
  }

  if (AUTH_CODES_SKIP_TOAST.has(apiError.code)) {
    return false;
  }

  return Boolean(apiError.message?.trim());
}

/**
 * Central routing for API failures: optional toast + normalized ApiError.
 * Auth logout on 401 is handled in the axios interceptor via `auth:error`.
 */
export function handleApiError(err: unknown, options?: HandleApiErrorOptions): ApiError {
  const apiError = toApiError(err);

  if (shouldToast(apiError, options)) {
    notify.apiError(apiError);
  }

  return apiError;
}

export function getApiErrorMessage(err: unknown): string {
  if (isApiError(err)) return err.message;
  return toApiError(err).message;
}
