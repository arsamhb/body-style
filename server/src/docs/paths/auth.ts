import { bearer, jsonBody, jsonResponse, ref, refResponse } from '../common';

export const authDocs = {
  tags: [
    {
      name: 'Auth',
      description: 'Back-office login, refresh rotation, profile',
    },
  ],
  schemas: {
    LoginPayload: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'developer@example.com',
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'developer123',
        },
      },
    },
    RefreshPayload: {
      type: 'object',
      required: ['refreshToken'],
      properties: { refreshToken: { type: 'string' } },
    },
    ChangePasswordPayload: {
      type: 'object',
      required: ['currentPassword', 'newPassword'],
      properties: {
        currentPassword: { type: 'string', format: 'password' },
        newPassword: {
          type: 'string',
          format: 'password',
          description:
            'Min PASSWORD_MIN_LENGTH chars, at least one letter and one digit.',
        },
      },
    },
    TokenPairResponse: {
      type: 'object',
      required: ['accessToken', 'refreshToken'],
      properties: {
        accessToken: {
          type: 'string',
          description:
            'Short-lived JWT (claims: sub, email, role, permissions)',
        },
        refreshToken: {
          type: 'string',
          description: 'Single-use; rotated on every /auth/refresh',
        },
      },
    },
    AdminMeResponse: {
      type: 'object',
      required: [
        'id',
        'email',
        'displayName',
        'role',
        'permissions',
        'isActive',
      ],
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
        displayName: { type: 'string' },
        role: ref('AdminRole'),
        permissions: {
          type: 'array',
          items: ref('PermissionKey'),
          description: 'Empty for developers (implicit all)',
        },
        isActive: { type: 'boolean' },
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login (rate limited: 10 / 15 min per IP)',
        operationId: 'postAuthLogin',
        requestBody: jsonBody('LoginPayload'),
        responses: {
          '200': jsonResponse('Token pair', 'TokenPairResponse'),
          '400': refResponse('ValidationError'),
          '401': refResponse('Unauthorized'),
          '429': refResponse('RateLimited'),
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rotate the refresh token and get a new pair',
        description:
          'The presented refresh token is consumed. Presenting it again revokes every session of the account.',
        operationId: 'postAuthRefresh',
        requestBody: jsonBody('RefreshPayload'),
        responses: {
          '200': jsonResponse('New token pair', 'TokenPairResponse'),
          '400': refResponse('ValidationError'),
          '401': refResponse('Unauthorized'),
          '429': refResponse('RateLimited'),
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Revoke a refresh token (idempotent)',
        operationId: 'postAuthLogout',
        requestBody: jsonBody('RefreshPayload'),
        responses: {
          '200': jsonResponse('Revoked', 'SuccessResponse'),
          '400': refResponse('ValidationError'),
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Current account (read from the database, not the token)',
        operationId: 'getAuthMe',
        security: bearer,
        responses: {
          '200': jsonResponse('Profile', 'AdminMeResponse'),
          '401': refResponse('Unauthorized'),
        },
      },
    },
    '/auth/password': {
      post: {
        tags: ['Auth'],
        summary: 'Change own password (revokes all sessions)',
        operationId: 'postAuthPassword',
        security: bearer,
        requestBody: jsonBody('ChangePasswordPayload'),
        responses: {
          '200': jsonResponse('Changed', 'SuccessResponse'),
          '400': refResponse('ValidationError'),
          '401': refResponse('Unauthorized'),
        },
      },
    },
  },
};
