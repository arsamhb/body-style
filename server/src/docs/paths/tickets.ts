import {
  bearer,
  idParam,
  jsonBody,
  jsonResponse,
  paginatedSchema,
  paginationParams,
  ref,
  refResponse,
} from '../common';
import {
  TICKET_SOURCE_PAGES,
  TICKET_STATUSES,
} from '../../modules/tickets/tickets.model';

export const ticketsDocs = {
  tags: [
    {
      name: 'Tickets',
      description:
        'Public request form (anti-abuse token + honeypot + rate limits) and the admin inbox',
    },
  ],
  schemas: {
    TicketTokenResponse: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'Single-use, HMAC-signed, valid 3s–1h after issue',
        },
        minDelayMs: { type: 'integer', example: 3000 },
      },
    },
    TicketCreatePayload: {
      type: 'object',
      required: ['name', 'phone', 'token', 'source'],
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 80 },
        phone: { type: 'string', example: '+98 912 000 0000' },
        message: { type: 'string', maxLength: 1000 },
        locale: { type: 'string', example: 'fa' },
        token: {
          type: 'string',
          description: 'From GET /public/tickets/token',
        },
        website: { type: 'string', description: 'Honeypot — must be empty' },
        source: {
          type: 'object',
          required: ['page'],
          properties: {
            page: { type: 'string', enum: [...TICKET_SOURCE_PAGES] },
            section: { type: 'string', example: 'landing-ticket' },
            itemId: { type: 'string' },
            itemSlug: { type: 'string' },
            path: { type: 'string', example: '/catalog/products/motor-3kw' },
          },
        },
      },
    },
    TicketReadResponse: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        phone: { type: 'string' },
        message: { type: 'string' },
        locale: { type: 'string' },
        status: { type: 'string', enum: [...TICKET_STATUSES] },
        adminNote: { type: 'string' },
        source: {
          type: 'object',
          properties: {
            page: { type: 'string' },
            section: { type: 'string' },
            itemId: { type: 'string' },
            itemSlug: { type: 'string' },
            itemTitle: { type: 'string' },
            path: { type: 'string' },
          },
        },
        userAgent: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    TicketUpdatePayload: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: [...TICKET_STATUSES] },
        adminNote: { type: 'string', maxLength: 2000 },
      },
    },
    PaginatedTicketResponse: paginatedSchema('TicketReadResponse'),
    DashboardResponse: {
      type: 'object',
      properties: {
        tickets: {
          type: 'object',
          properties: {
            new: { type: 'integer' },
            inProgress: { type: 'integer' },
            closed: { type: 'integer' },
            total: { type: 'integer' },
          },
        },
        catalog: {
          type: 'object',
          properties: {
            published: { type: 'integer' },
            draft: { type: 'integer' },
            types: { type: 'integer' },
          },
        },
        pages: {
          type: 'object',
          properties: {
            enabled: { type: 'integer' },
            total: { type: 'integer' },
          },
        },
        media: { type: 'object', properties: { total: { type: 'integer' } } },
      },
    },
  },
  paths: {
    '/public/tickets/token': {
      get: {
        tags: ['Tickets'],
        summary: 'Issue a form token (30 / 15 min per IP)',
        operationId: 'getPublicTicketsToken',
        responses: {
          '200': jsonResponse('Token', 'TicketTokenResponse'),
          '429': refResponse('RateLimited'),
        },
      },
    },
    '/public/tickets': {
      post: {
        tags: ['Tickets'],
        summary:
          'Submit a request (5 / 15 min per IP). Honeypot hits get 201 but are dropped.',
        operationId: 'postPublicTickets',
        requestBody: jsonBody('TicketCreatePayload'),
        responses: {
          '201': {
            description: 'Accepted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    id: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description:
              'Validation failed or token problem (codes TOKEN_INVALID | TOKEN_TOO_EARLY | TOKEN_EXPIRED | TOKEN_USED)',
            content: { 'application/json': { schema: ref('ApiError') } },
          },
          '429': refResponse('RateLimited'),
        },
      },
    },
    '/admin/tickets': {
      get: {
        tags: ['Tickets'],
        summary: 'Inbox (permission: tickets.read)',
        operationId: 'getAdminTickets',
        security: bearer,
        parameters: [
          ...paginationParams,
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: [...TICKET_STATUSES] },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'string', enum: [...TICKET_SOURCE_PAGES] },
          },
          { name: 'q', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': jsonResponse('Tickets', 'PaginatedTicketResponse'),
          '401': refResponse('Unauthorized'),
          '403': refResponse('Forbidden'),
        },
      },
    },
    '/admin/tickets/{id}': {
      parameters: [idParam()],
      get: {
        tags: ['Tickets'],
        summary: 'Read (permission: tickets.read)',
        operationId: 'getAdminTicketsById',
        security: bearer,
        responses: {
          '200': jsonResponse('Ticket', 'TicketReadResponse'),
          '404': refResponse('NotFound'),
        },
      },
      patch: {
        tags: ['Tickets'],
        summary: 'Status / note (permission: tickets.write)',
        operationId: 'patchAdminTicketsById',
        security: bearer,
        requestBody: jsonBody('TicketUpdatePayload'),
        responses: {
          '200': jsonResponse('Ticket', 'TicketReadResponse'),
          '403': refResponse('Forbidden'),
          '404': refResponse('NotFound'),
        },
      },
      delete: {
        tags: ['Tickets'],
        summary: 'Delete (permission: tickets.write)',
        operationId: 'deleteAdminTicketsById',
        security: bearer,
        responses: {
          '200': jsonResponse('Deleted', 'SuccessResponse'),
          '403': refResponse('Forbidden'),
          '404': refResponse('NotFound'),
        },
      },
    },
    '/admin/dashboard': {
      get: {
        tags: ['Tickets'],
        summary: 'Counts for the panel home',
        operationId: 'getAdminDashboard',
        security: bearer,
        responses: {
          '200': jsonResponse('Counts', 'DashboardResponse'),
          '401': refResponse('Unauthorized'),
        },
      },
    },
  },
};
