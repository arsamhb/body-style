import {
  arrayResponse,
  bearer,
  idParam,
  jsonBody,
  jsonResponse,
  paginatedSchema,
  paginationParams,
  ref,
  refResponse,
} from '../common';

export const usersDocs = {
  tags: [
    {
      name: 'Users',
      description: 'Back-office accounts and permissions (developer only)',
    },
  ],
  schemas: {
    UserReadResponse: {
      type: 'object',
      required: [
        'id',
        'email',
        'displayName',
        'role',
        'permissions',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
        displayName: { type: 'string' },
        role: ref('AdminRole'),
        permissions: { type: 'array', items: ref('PermissionKey') },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    UserCreatePayload: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
        displayName: { type: 'string', maxLength: 80 },
        role: ref('AdminRole'),
        permissions: {
          type: 'array',
          items: ref('PermissionKey'),
          description: 'Ignored for developers',
        },
      },
    },
    UserUpdatePayload: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: {
          type: 'string',
          format: 'password',
          description: 'Setting it revokes the user sessions',
        },
        displayName: { type: 'string', maxLength: 80 },
        role: ref('AdminRole'),
        permissions: { type: 'array', items: ref('PermissionKey') },
        isActive: { type: 'boolean' },
      },
    },
    PaginatedUserResponse: paginatedSchema('UserReadResponse'),
  },
  paths: {
    '/admin/users': {
      get: {
        tags: ['Users'],
        summary: 'List accounts (array, or envelope when limit/offset present)',
        operationId: 'getAdminUsers',
        security: bearer,
        parameters: paginationParams,
        responses: {
          '200': {
            description: 'Accounts',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { type: 'array', items: ref('UserReadResponse') },
                    ref('PaginatedUserResponse'),
                  ],
                },
              },
            },
          },
          '401': refResponse('Unauthorized'),
          '403': refResponse('Forbidden'),
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create an account',
        operationId: 'postAdminUsers',
        security: bearer,
        requestBody: jsonBody('UserCreatePayload'),
        responses: {
          '201': jsonResponse('Created', 'UserReadResponse'),
          '400': refResponse('ValidationError'),
          '401': refResponse('Unauthorized'),
          '403': refResponse('Forbidden'),
          '409': refResponse('Conflict'),
        },
      },
    },
    '/admin/users/{id}': {
      parameters: [idParam()],
      get: {
        tags: ['Users'],
        summary: 'Read an account',
        operationId: 'getAdminUsersById',
        security: bearer,
        responses: {
          '200': jsonResponse('Account', 'UserReadResponse'),
          '401': refResponse('Unauthorized'),
          '403': refResponse('Forbidden'),
          '404': refResponse('NotFound'),
        },
      },
      patch: {
        tags: ['Users'],
        summary:
          'Update an account (cannot change own role/state; keeps one active developer)',
        operationId: 'patchAdminUsersById',
        security: bearer,
        requestBody: jsonBody('UserUpdatePayload'),
        responses: {
          '200': jsonResponse('Updated', 'UserReadResponse'),
          '400': refResponse('ValidationError'),
          '401': refResponse('Unauthorized'),
          '403': refResponse('Forbidden'),
          '404': refResponse('NotFound'),
          '409': refResponse('Conflict'),
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete an account (not self, not the last developer)',
        operationId: 'deleteAdminUsersById',
        security: bearer,
        responses: {
          '200': jsonResponse('Deleted', 'SuccessResponse'),
          '401': refResponse('Unauthorized'),
          '403': refResponse('Forbidden'),
          '404': refResponse('NotFound'),
          '409': refResponse('Conflict'),
        },
      },
    },
  },
  /** Exposed so the list endpoint can document both shapes without a second helper. */
  arrayResponse,
};
