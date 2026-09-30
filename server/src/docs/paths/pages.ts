import {
  bearer,
  jsonBody,
  jsonResponse,
  localeParam,
  ref,
  refResponse,
} from '../common';
import {
  ALLOWED_ON_PAGE,
  PAGE_KEYS,
  SECTION_TYPES,
} from '../../modules/pages/sections.types';

const keyParam = {
  name: 'key',
  in: 'path',
  required: true,
  schema: { type: 'string', enum: [...PAGE_KEYS] },
};
const sectionIdParam = {
  name: 'sectionId',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const pageResponses = {
  '200': jsonResponse('Page', 'PageAdminReadResponse'),
  '400': refResponse('ValidationError'),
  '401': refResponse('Unauthorized'),
  '403': refResponse('Forbidden'),
  '404': refResponse('NotFound'),
};

export const pagesDocs = {
  tags: [
    {
      name: 'Pages',
      description:
        'Page composition: toggleable, orderable sections with typed props',
    },
  ],
  schemas: {
    SectionType: { type: 'string', enum: [...SECTION_TYPES] },
    SectionAdminResponse: {
      type: 'object',
      required: ['id', 'key', 'type', 'enabled', 'order', 'props'],
      properties: {
        id: { type: 'string' },
        key: {
          type: 'string',
          example: 'landing-hero',
          description: 'Stable anchor; tickets report it as their source',
        },
        type: ref('SectionType'),
        enabled: { type: 'boolean' },
        order: { type: 'integer' },
        props: {
          type: 'object',
          description:
            'Shape depends on `type`; localized fields are LocalizedString maps',
        },
      },
    },
    PageAdminReadResponse: {
      type: 'object',
      properties: {
        key: { type: 'string', enum: [...PAGE_KEYS] },
        enabled: { type: 'boolean' },
        seo: {
          type: 'object',
          properties: {
            title: ref('LocalizedString'),
            description: ref('LocalizedString'),
            ogImageUrl: { type: 'string' },
          },
        },
        sections: { type: 'array', items: ref('SectionAdminResponse') },
        allowedSectionTypes: {
          type: 'array',
          items: ref('SectionType'),
          example: ALLOWED_ON_PAGE.landing,
        },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    PageAdminSummaryResponse: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        enabled: { type: 'boolean' },
        sectionCount: { type: 'integer' },
        enabledSectionCount: { type: 'integer' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    PageSeoUpdatePayload: {
      type: 'object',
      properties: {
        title: ref('LocalizedString'),
        description: ref('LocalizedString'),
        ogImageUrl: { type: 'string' },
      },
    },
    PageEnabledUpdatePayload: {
      type: 'object',
      required: ['enabled'],
      properties: { enabled: { type: 'boolean' } },
    },
    SectionCreatePayload: {
      type: 'object',
      required: ['type'],
      properties: {
        type: ref('SectionType'),
        key: { type: 'string' },
        props: { type: 'object' },
      },
    },
    SectionUpdatePayload: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        key: { type: 'string' },
        props: {
          type: 'object',
          description: 'Validated against the section type schema',
        },
      },
    },
    SectionsReorderPayload: {
      type: 'object',
      required: ['orderedIds'],
      properties: { orderedIds: { type: 'array', items: { type: 'string' } } },
    },
    PagePublicReadResponse: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        seo: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            ogImageUrl: { type: 'string' },
          },
        },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            description: 'Enabled sections, sorted, with locale-resolved props',
          },
        },
      },
    },
  },
  paths: {
    '/admin/pages': {
      get: {
        tags: ['Pages'],
        summary: 'List pages with section counts',
        operationId: 'getAdminPages',
        security: bearer,
        responses: {
          '200': {
            description: 'Pages',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: ref('PageAdminSummaryResponse'),
                },
              },
            },
          },
          '401': refResponse('Unauthorized'),
        },
      },
    },
    '/admin/pages/{key}': {
      parameters: [keyParam],
      get: {
        tags: ['Pages'],
        summary: 'Read a page with all sections (full localized maps)',
        operationId: 'getAdminPagesByKey',
        security: bearer,
        responses: pageResponses,
      },
      patch: {
        tags: ['Pages'],
        summary: 'Update page SEO (permission: pages.<key>)',
        operationId: 'patchAdminPagesByKey',
        security: bearer,
        requestBody: jsonBody('PageSeoUpdatePayload'),
        responses: pageResponses,
      },
    },
    '/admin/pages/{key}/enabled': {
      parameters: [keyParam],
      patch: {
        tags: ['Pages'],
        summary: 'Enable/disable the whole page (developer only)',
        operationId: 'patchAdminPagesEnabledByKey',
        security: bearer,
        requestBody: jsonBody('PageEnabledUpdatePayload'),
        responses: pageResponses,
      },
    },
    '/admin/pages/{key}/sections': {
      parameters: [keyParam],
      post: {
        tags: ['Pages'],
        summary:
          'Add a section (developer only; type must be allowed on the page)',
        operationId: 'postAdminPagesSectionsByKey',
        security: bearer,
        requestBody: jsonBody('SectionCreatePayload'),
        responses: {
          ...pageResponses,
          '201': jsonResponse(
            'Page with the new section (`createdSectionId`)',
            'PageAdminReadResponse',
          ),
          '409': refResponse('Conflict'),
        },
      },
    },
    '/admin/pages/{key}/sections/reorder': {
      parameters: [keyParam],
      patch: {
        tags: ['Pages'],
        summary: 'Reorder sections (permission: pages.<key>)',
        operationId: 'patchAdminPagesSectionsReorderByKey',
        security: bearer,
        requestBody: jsonBody('SectionsReorderPayload'),
        responses: pageResponses,
      },
    },
    '/admin/pages/{key}/sections/{sectionId}': {
      parameters: [keyParam, sectionIdParam],
      patch: {
        tags: ['Pages'],
        summary: 'Toggle or edit a section (permission: pages.<key>)',
        operationId: 'patchAdminPagesSectionsByKeyBySectionId',
        security: bearer,
        requestBody: jsonBody('SectionUpdatePayload'),
        responses: pageResponses,
      },
      delete: {
        tags: ['Pages'],
        summary: 'Remove a section (developer only)',
        operationId: 'deleteAdminPagesSectionsByKeyBySectionId',
        security: bearer,
        responses: pageResponses,
      },
    },
    '/public/pages/{key}': {
      parameters: [keyParam, localeParam],
      get: {
        tags: ['Public'],
        summary:
          'Enabled sections of a page, locale-resolved (404 when the page is disabled)',
        operationId: 'getPublicPagesByKey',
        responses: {
          '200': jsonResponse('Page', 'PagePublicReadResponse'),
          '404': refResponse('NotFound'),
        },
      },
    },
  },
};
