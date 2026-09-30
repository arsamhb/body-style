export interface ApiErrorDetail {
  field: string;
  code: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

/** Parsed error including HTTP status for routing (logout, retry, etc.). */
export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

// Neutral, language-independent fallback. UI layers translate known error codes via next-intl.
export const DEFAULT_API_ERROR_MESSAGE = 'Request failed.';

export const UNKNOWN_API_ERROR: ApiError = {
  status: 0,
  code: 'INTERNAL_ERROR',
  message: DEFAULT_API_ERROR_MESSAGE,
};

export function isApiErrorBody(body: unknown): body is ApiErrorBody {
  if (typeof body !== 'object' || body === null) return false;
  const err = (body as Record<string, unknown>).error;
  if (typeof err !== 'object' || err === null) return false;
  const e = err as Record<string, unknown>;
  return typeof e.code === 'string' && typeof e.message === 'string';
}

export function isApiError(err: unknown): err is ApiError {
  if (typeof err !== 'object' || err === null) return false;
  const e = err as Record<string, unknown>;
  return (
    typeof e.code === 'string' && typeof e.message === 'string' && typeof e.status === 'number'
  );
}

/** Legacy axios wrapper shape before unified errors. */
function isLegacyErrorPayload(body: unknown): body is { message: string; statusCode?: number } {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as Record<string, unknown>).message === 'string'
  );
}

export function parseApiErrorFromBody(status: number, body: unknown): ApiError {
  if (isApiErrorBody(body)) {
    return { status, ...body.error };
  }

  if (isLegacyErrorPayload(body)) {
    return {
      status: body.statusCode ?? status,
      code: 'INTERNAL_ERROR',
      message: body.message,
    };
  }

  const detail = (body as { detail?: unknown })?.detail;
  if (typeof detail === 'string') {
    return { status, code: 'INTERNAL_ERROR', message: detail };
  }

  return {
    status,
    code: 'INTERNAL_ERROR',
    message: DEFAULT_API_ERROR_MESSAGE,
  };
}

export function toApiError(err: unknown): ApiError {
  const axiosLike = err as {
    response?: { status?: number; data?: unknown };
    status?: number;
  };

  // An AxiosError also has `code`/`message`/`status`, so the response body must be checked
  // before the structural `isApiError` test or the API envelope would be ignored.
  if (axiosLike?.response) {
    return parseApiErrorFromBody(axiosLike.response.status ?? 0, axiosLike.response.data ?? null);
  }

  if (isApiError(err)) return err;

  if (typeof err === 'object' && err !== null && isApiErrorBody(err)) {
    return { status: 0, ...err.error };
  }

  if (isLegacyErrorPayload(err)) {
    return {
      status: err.statusCode ?? 0,
      code: 'INTERNAL_ERROR',
      message: err.message,
    };
  }

  return UNKNOWN_API_ERROR;
}
