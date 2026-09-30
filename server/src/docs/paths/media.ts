import {
  bearer,
  idParam,
  jsonResponse,
  paginatedSchema,
  paginationParams,
  ref,
  refResponse,
} from '../common';

export const mediaDocs = {
  tags: [
    {
      name: 'Media',
      description: 'Image library (uploads are re-encoded to WebP)',
    },
  ],
  schemas: {
    MediaReadResponse: {
      type: 'object',
      required: [
        'id',
        'url',
        'thumbUrl',
        'mime',
        'width',
        'height',
        'size',
        'alt',
        'createdAt',
      ],
      properties: {
        id: { type: 'string' },
        url: {
          type: 'string',
          example: '/uploads/2026/09/1727700000000-ab12cd34ef56ab12.webp',
        },
        thumbUrl: { type: 'string' },
        mime: { type: 'string', example: 'image/webp' },
        width: { type: 'integer' },
        height: { type: 'integer' },
        size: { type: 'integer', description: 'bytes' },
        alt: ref('LocalizedString'),
        originalName: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
    MediaAltUpdatePayload: {
      type: 'object',
      properties: { alt: ref('LocalizedString') },
    },
    PaginatedMediaResponse: paginatedSchema('MediaReadResponse'),
  },
  paths: {
    '/admin/media': {
      get: {
        tags: ['Media'],
        summary: 'List images (newest first)',
        operationId: 'getAdminMedia',
        security: bearer,
        parameters: paginationParams,
        responses: {
          '200': jsonResponse('Images', 'PaginatedMediaResponse'),
          '401': refResponse('Unauthorized'),
        },
      },
      post: {
        tags: ['Media'],
        summary: 'Upload an image (permission: media)',
        operationId: 'postAdminMedia',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'jpeg/png/webp/avif/gif, ≤ MAX_UPLOAD_MB',
                  },
                  alt: {
                    type: 'string',
                    description: 'JSON-encoded LocalizedString',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': jsonResponse('Stored image', 'MediaReadResponse'),
          '400': refResponse('ValidationError'),
          '401': refResponse('Unauthorized'),
          '403': refResponse('Forbidden'),
        },
      },
    },
    '/admin/media/{id}': {
      parameters: [idParam()],
      get: {
        tags: ['Media'],
        summary: 'Read one image',
        operationId: 'getAdminMediaById',
        security: bearer,
        responses: {
          '200': jsonResponse('Image', 'MediaReadResponse'),
          '404': refResponse('NotFound'),
        },
      },
      patch: {
        tags: ['Media'],
        summary: 'Update alt text (permission: media)',
        operationId: 'patchAdminMediaById',
        security: bearer,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: ref('MediaAltUpdatePayload') },
          },
        },
        responses: {
          '200': jsonResponse('Image', 'MediaReadResponse'),
          '403': refResponse('Forbidden'),
          '404': refResponse('NotFound'),
        },
      },
      delete: {
        tags: ['Media'],
        summary: 'Delete an image and its files (permission: media)',
        operationId: 'deleteAdminMediaById',
        security: bearer,
        responses: {
          '200': jsonResponse('Deleted', 'SuccessResponse'),
          '403': refResponse('Forbidden'),
          '404': refResponse('NotFound'),
        },
      },
    },
  },
};
