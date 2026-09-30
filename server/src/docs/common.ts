/**
 * Building blocks shared by every `docs/paths/*.ts` file. The OpenAPI document is hand-written;
 * these helpers keep it short and consistent with `ApiError` and `core/pagination`.
 */
import { ErrorCode } from '../core/errors/ApiError';
import { PERMISSIONS, ADMIN_ROLES } from '../core/auth/permissions';

export const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
export const refResponse = (name: string) => ({
  $ref: `#/components/responses/${name}`,
});

export const jsonBody = (schemaName: string, required = true) => ({
  required,
  content: { 'application/json': { schema: ref(schemaName) } },
});

export const jsonResponse = (description: string, schemaName: string) => ({
  description,
  content: { 'application/json': { schema: ref(schemaName) } },
});

export const arrayResponse = (description: string, itemSchema: string) => ({
  description,
  content: {
    'application/json': { schema: { type: 'array', items: ref(itemSchema) } },
  },
});

export const idParam = (name = 'id', description = 'MongoDB ObjectId') => ({
  name,
  in: 'path',
  required: true,
  description,
  schema: { type: 'string', example: '665f1c2e9b1d4a3f8c0e1234' },
});

export const localeParam = {
  name: 'locale',
  in: 'query',
  required: false,
  description:
    'Locale to resolve content in (falls back to the default locale).',
  schema: { type: 'string', example: 'fa' },
};

export const paginationParams = [
  {
    name: 'limit',
    in: 'query',
    required: false,
    description:
      'Page size (1–100). Presence of limit/offset switches the response to the envelope.',
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
  },
  {
    name: 'offset',
    in: 'query',
    required: false,
    schema: { type: 'integer', minimum: 0, default: 0 },
  },
];

/** `{ data, total, limit, offset, total_pages }` envelope around `itemSchema`. */
export const paginatedSchema = (itemSchema: string) => ({
  type: 'object',
  required: ['data', 'total', 'limit', 'offset', 'total_pages'],
  properties: {
    data: { type: 'array', items: ref(itemSchema) },
    total: { type: 'integer', example: 42 },
    limit: { type: 'integer', example: 50 },
    offset: { type: 'integer', example: 0 },
    total_pages: { type: 'integer', example: 1 },
  },
});

export const bearer = [{ bearerAuth: [] }];

export const LocalizedString = {
  type: 'object',
  description: 'Per-locale text, keyed by locale code.',
  additionalProperties: { type: 'string' },
  example: { fa: 'متن', en: 'Text' },
};

export const commonSchemas = {
  ApiErrorDetail: {
    type: 'object',
    required: ['field', 'code', 'message'],
    properties: {
      field: { type: 'string', example: 'email' },
      code: { type: 'string', example: 'required' },
      message: { type: 'string', example: 'Email is required' },
    },
  },
  ApiError: {
    type: 'object',
    required: ['error'],
    properties: {
      error: {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: Object.values(ErrorCode),
            example: 'VALIDATION_ERROR',
          },
          message: { type: 'string', example: 'Validation failed' },
          details: { type: 'array', items: ref('ApiErrorDetail') },
        },
      },
    },
  },
  SuccessResponse: {
    type: 'object',
    required: ['success'],
    properties: { success: { type: 'boolean', example: true } },
  },
  LocalizedString,
  AdminRole: { type: 'string', enum: [...ADMIN_ROLES] },
  PermissionKey: { type: 'string', enum: [...PERMISSIONS] },
};

const errorResponse = (description: string) => ({
  description,
  content: { 'application/json': { schema: ref('ApiError') } },
});

export const commonResponses = {
  ValidationError: errorResponse(
    'Validation failed (details[].field maps to form fields)',
  ),
  BadRequest: errorResponse('Malformed request'),
  Unauthorized: errorResponse('Missing/invalid/expired access token'),
  Forbidden: errorResponse('Role or permission does not allow this'),
  NotFound: errorResponse('Resource not found'),
  Conflict: errorResponse('Resource already exists or state conflict'),
  RateLimited: errorResponse('Too many requests'),
};
