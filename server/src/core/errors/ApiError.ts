/**
 * Error model. `ApiError.toBody()` serializes to exactly the envelope the frontend expects:
 *   { error: { code, message, details? } }
 * (see src/lib/api/errors.ts on the frontend). The HTTP status is carried separately.
 */

export interface ApiErrorDetail {
  field: string;
  code: string;
  message: string;
}

/** Codes the frontend gives special meaning to (toast suppression, logout, inline form errors). */
export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ApiErrorDetail[];

  constructor(
    status: number,
    code: string,
    message: string,
    details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  toBody(): ApiErrorBody {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && this.details.length
          ? { details: this.details }
          : {}),
      },
    };
  }

  static validation(
    details: ApiErrorDetail[],
    message = 'Validation failed',
  ): ApiError {
    return new ApiError(400, ErrorCode.VALIDATION_ERROR, message, details);
  }

  static badRequest(
    message = 'Bad request',
    code: string = ErrorCode.BAD_REQUEST,
  ): ApiError {
    return new ApiError(400, code, message);
  }

  static unauthorized(
    message = 'Authentication required',
    code: string = ErrorCode.NOT_AUTHENTICATED,
  ): ApiError {
    return new ApiError(401, code, message);
  }

  static invalidCredentials(message = 'Invalid email or password'): ApiError {
    return new ApiError(401, ErrorCode.INVALID_CREDENTIALS, message);
  }

  static forbidden(
    message = 'You do not have permission to do this',
  ): ApiError {
    return new ApiError(403, ErrorCode.FORBIDDEN, message);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, ErrorCode.NOT_FOUND, message);
  }

  static conflict(message = 'Resource already exists'): ApiError {
    return new ApiError(409, ErrorCode.CONFLICT, message);
  }

  static payloadTooLarge(message = 'Payload too large'): ApiError {
    return new ApiError(413, ErrorCode.PAYLOAD_TOO_LARGE, message);
  }

  static tooManyRequests(
    message = 'Too many requests, please try again later',
  ): ApiError {
    return new ApiError(429, ErrorCode.RATE_LIMITED, message);
  }
}
