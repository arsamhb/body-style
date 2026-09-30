import {
  bearer,
  idParam,
  jsonBody,
  jsonResponse,
  localeParam,
  paginatedSchema,
  paginationParams,
  ref,
  refResponse,
} from '../common';
import {
  CARD_VARIANTS,
  IMAGE_RATIOS,
  ITEM_STATUSES,
  SPEC_TYPES,
} from '../../modules/catalog/catalog.types';

const typeSlugParam = {
  name: 'typeSlug',
  in: 'path',
  required: true,
  schema: { type: 'string', example: 'products' },
};
const itemSlugParam = {
  name: 'itemSlug',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const crud = (schema: string) => ({
  '200': jsonResponse('OK', schema),
  '400': refResponse('ValidationError'),
  '401': refResponse('Unauthorized'),
  '403': refResponse('Forbidden'),
  '404': refResponse('NotFound'),
  '409': refResponse('Conflict'),
});

export const catalogDocs = {
  tags: [
    {
      name: 'Catalog',
      description:
        'Types (developer-designed specs + card), categories and items',
    },
  ],
  schemas: {
    SpecType: { type: 'string', enum: [...SPEC_TYPES] },
    SpecDefinition: {
      type: 'object',
      required: ['key', 'label', 'type'],
      properties: {
        key: {
          type: 'string',
          example: 'price',
          description: '^[a-z][a-zA-Z0-9_]{0,31}$, unique per type',
        },
        label: ref('LocalizedString'),
        type: ref('SpecType'),
        unit: ref('LocalizedString'),
        currency: { type: 'string', example: 'تومان' },
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              label: ref('LocalizedString'),
            },
          },
        },
        filterable: { type: 'boolean' },
        showOnCard: { type: 'boolean' },
        showOnDetail: { type: 'boolean' },
        required: { type: 'boolean' },
        order: { type: 'integer' },
      },
    },
    CardDesign: {
      type: 'object',
      properties: {
        variant: { type: 'string', enum: [...CARD_VARIANTS] },
        imageRatio: { type: 'string', enum: [...IMAGE_RATIOS] },
        showSummary: { type: 'boolean' },
        cardSpecKeys: { type: 'array', items: { type: 'string' }, maxItems: 4 },
        badgeSpecKey: { type: 'string' },
        priceSpecKey: { type: 'string' },
      },
    },
    FilterConfig: {
      type: 'object',
      properties: {
        categoriesEnabled: { type: 'boolean' },
        searchEnabled: { type: 'boolean' },
        enabledFilterKeys: {
          type: 'array',
          items: { type: 'string' },
          description: 'Subset of filterable spec keys exposed on the site',
        },
        sortKeys: { type: 'array', items: { type: 'string' } },
      },
    },
    CatalogTypeAdminResponse: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        slug: { type: 'string' },
        name: ref('LocalizedString'),
        description: ref('LocalizedString'),
        specDefinitions: { type: 'array', items: ref('SpecDefinition') },
        cardDesign: ref('CardDesign'),
        filterConfig: ref('FilterConfig'),
        seo: {
          type: 'object',
          properties: {
            title: ref('LocalizedString'),
            description: ref('LocalizedString'),
          },
        },
        enabled: { type: 'boolean' },
        order: { type: 'integer' },
        itemCount: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    CatalogTypeWritePayload: {
      type: 'object',
      properties: {
        slug: { type: 'string' },
        name: ref('LocalizedString'),
        description: ref('LocalizedString'),
        specDefinitions: { type: 'array', items: ref('SpecDefinition') },
        cardDesign: ref('CardDesign'),
        filterConfig: ref('FilterConfig'),
        seo: { type: 'object' },
        enabled: { type: 'boolean' },
        order: { type: 'integer' },
      },
    },
    CatalogCategoryAdminResponse: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        typeId: { type: 'string' },
        slug: { type: 'string' },
        name: ref('LocalizedString'),
        order: { type: 'integer' },
      },
    },
    CatalogCategoryWritePayload: {
      type: 'object',
      properties: {
        typeId: { type: 'string' },
        slug: { type: 'string' },
        name: ref('LocalizedString'),
        order: { type: 'integer' },
      },
    },
    CatalogItemAdminResponse: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        typeId: { type: 'string' },
        slug: { type: 'string' },
        title: ref('LocalizedString'),
        summary: ref('LocalizedString'),
        description: ref('LocalizedString'),
        coverImage: { type: 'string' },
        images: { type: 'array', items: { type: 'string' } },
        categoryIds: { type: 'array', items: { type: 'string' } },
        specs: {
          type: 'object',
          additionalProperties: true,
          description: 'Keyed by spec key; values typed per definition',
        },
        featured: { type: 'boolean' },
        order: { type: 'integer' },
        status: { type: 'string', enum: [...ITEM_STATUSES] },
        seo: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    CatalogItemWritePayload: {
      type: 'object',
      properties: {
        typeId: { type: 'string' },
        slug: { type: 'string' },
        title: ref('LocalizedString'),
        summary: ref('LocalizedString'),
        description: ref('LocalizedString'),
        coverImage: { type: 'string' },
        images: { type: 'array', items: { type: 'string' } },
        categoryIds: { type: 'array', items: { type: 'string' } },
        specs: { type: 'object', additionalProperties: true },
        featured: { type: 'boolean' },
        order: { type: 'integer' },
        status: { type: 'string', enum: [...ITEM_STATUSES] },
        seo: { type: 'object' },
      },
    },
    CatalogItemStatusPayload: {
      type: 'object',
      required: ['status'],
      properties: { status: { type: 'string', enum: [...ITEM_STATUSES] } },
    },
    PaginatedCatalogItemAdminResponse: paginatedSchema(
      'CatalogItemAdminResponse',
    ),
    PublicSpec: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        label: { type: 'string' },
        type: ref('SpecType'),
        unit: { type: 'string' },
        currency: { type: 'string' },
        value: { description: 'string | number | boolean | string[]' },
        valueLabel: {
          type: 'string',
          description: 'Option label(s) for select/multiselect',
        },
      },
    },
    CatalogTypePublicResponse: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        slug: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        href: { type: 'string' },
        itemCount: { type: 'integer' },
        categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              slug: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
        filters: {
          type: 'array',
          items: {
            type: 'object',
            description: 'Filterable + enabled spec definitions, resolved',
          },
        },
        categoriesEnabled: { type: 'boolean' },
        searchEnabled: { type: 'boolean' },
        sortKeys: { type: 'array', items: { type: 'string' } },
        cardDesign: ref('CardDesign'),
        seo: { type: 'object' },
      },
    },
    CatalogItemCardResponse: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        slug: { type: 'string' },
        href: { type: 'string' },
        title: { type: 'string' },
        summary: { type: 'string' },
        coverImage: { type: 'string' },
        featured: { type: 'boolean' },
        categories: { type: 'array', items: { type: 'object' } },
        badge: ref('PublicSpec'),
        price: ref('PublicSpec'),
        cardSpecs: { type: 'array', items: ref('PublicSpec') },
      },
    },
    CatalogItemPublicResponse: {
      allOf: [
        ref('CatalogItemCardResponse'),
        {
          type: 'object',
          properties: {
            description: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            specs: { type: 'array', items: ref('PublicSpec') },
            seo: { type: 'object' },
            type: {
              type: 'object',
              properties: {
                slug: { type: 'string' },
                name: { type: 'string' },
                href: { type: 'string' },
              },
            },
          },
        },
      ],
    },
    PaginatedCatalogItemCardResponse: paginatedSchema(
      'CatalogItemCardResponse',
    ),
  },
  paths: {
    '/admin/catalog/types': {
      get: {
        tags: ['Catalog'],
        summary: 'List types',
        operationId: 'getAdminCatalogTypes',
        security: bearer,
        responses: {
          '200': {
            description: 'Types',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: ref('CatalogTypeAdminResponse'),
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Catalog'],
        summary: 'Create a type (developer)',
        operationId: 'postAdminCatalogTypes',
        security: bearer,
        requestBody: jsonBody('CatalogTypeWritePayload'),
        responses: {
          ...crud('CatalogTypeAdminResponse'),
          '201': jsonResponse('Created', 'CatalogTypeAdminResponse'),
        },
      },
    },
    '/admin/catalog/types/{id}': {
      parameters: [idParam()],
      get: {
        tags: ['Catalog'],
        summary: 'Read a type',
        operationId: 'getAdminCatalogTypesById',
        security: bearer,
        responses: crud('CatalogTypeAdminResponse'),
      },
      patch: {
        tags: ['Catalog'],
        summary:
          'Update a type (developer). Removed spec keys are unset on items.',
        operationId: 'patchAdminCatalogTypesById',
        security: bearer,
        requestBody: jsonBody('CatalogTypeWritePayload'),
        responses: crud('CatalogTypeAdminResponse'),
      },
      delete: {
        tags: ['Catalog'],
        summary: 'Delete a type (developer; refused while it has items)',
        operationId: 'deleteAdminCatalogTypesById',
        security: bearer,
        responses: crud('SuccessResponse'),
      },
    },
    '/admin/catalog/categories': {
      get: {
        tags: ['Catalog'],
        summary: 'List categories',
        operationId: 'getAdminCatalogCategories',
        security: bearer,
        parameters: [
          { name: 'typeId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Categories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: ref('CatalogCategoryAdminResponse'),
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Catalog'],
        summary: 'Create (permission: catalog.categories)',
        operationId: 'postAdminCatalogCategories',
        security: bearer,
        requestBody: jsonBody('CatalogCategoryWritePayload'),
        responses: {
          ...crud('CatalogCategoryAdminResponse'),
          '201': jsonResponse('Created', 'CatalogCategoryAdminResponse'),
        },
      },
    },
    '/admin/catalog/categories/{id}': {
      parameters: [idParam()],
      patch: {
        tags: ['Catalog'],
        summary: 'Update (permission: catalog.categories)',
        operationId: 'patchAdminCatalogCategoriesById',
        security: bearer,
        requestBody: jsonBody('CatalogCategoryWritePayload'),
        responses: crud('CatalogCategoryAdminResponse'),
      },
      delete: {
        tags: ['Catalog'],
        summary:
          'Delete (permission: catalog.categories); items keep other categories',
        operationId: 'deleteAdminCatalogCategoriesById',
        security: bearer,
        responses: crud('SuccessResponse'),
      },
    },
    '/admin/catalog/items': {
      get: {
        tags: ['Catalog'],
        summary: 'List items (paginated envelope)',
        operationId: 'getAdminCatalogItems',
        security: bearer,
        parameters: [
          ...paginationParams,
          { name: 'typeId', in: 'query', schema: { type: 'string' } },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: [...ITEM_STATUSES] },
          },
          { name: 'categoryId', in: 'query', schema: { type: 'string' } },
          { name: 'q', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': jsonResponse('Items', 'PaginatedCatalogItemAdminResponse'),
        },
      },
      post: {
        tags: ['Catalog'],
        summary:
          'Create (permission: catalog.items). specs validated against the type.',
        operationId: 'postAdminCatalogItems',
        security: bearer,
        requestBody: jsonBody('CatalogItemWritePayload'),
        responses: {
          ...crud('CatalogItemAdminResponse'),
          '201': jsonResponse('Created', 'CatalogItemAdminResponse'),
        },
      },
    },
    '/admin/catalog/items/{id}': {
      parameters: [idParam()],
      get: {
        tags: ['Catalog'],
        summary: 'Read an item',
        operationId: 'getAdminCatalogItemsById',
        security: bearer,
        responses: crud('CatalogItemAdminResponse'),
      },
      patch: {
        tags: ['Catalog'],
        summary: 'Update (permission: catalog.items)',
        operationId: 'patchAdminCatalogItemsById',
        security: bearer,
        requestBody: jsonBody('CatalogItemWritePayload'),
        responses: crud('CatalogItemAdminResponse'),
      },
      delete: {
        tags: ['Catalog'],
        summary: 'Delete (permission: catalog.items)',
        operationId: 'deleteAdminCatalogItemsById',
        security: bearer,
        responses: crud('SuccessResponse'),
      },
    },
    '/admin/catalog/items/{id}/status': {
      parameters: [idParam()],
      patch: {
        tags: ['Catalog'],
        summary: 'Publish / unpublish',
        operationId: 'patchAdminCatalogItemsStatusById',
        security: bearer,
        requestBody: jsonBody('CatalogItemStatusPayload'),
        responses: crud('CatalogItemAdminResponse'),
      },
    },
    '/public/catalog/types': {
      get: {
        tags: ['Public'],
        summary: 'Enabled catalog types',
        operationId: 'getPublicCatalogTypes',
        parameters: [localeParam],
        responses: {
          '200': {
            description: 'Types',
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'object' } },
              },
            },
          },
        },
      },
    },
    '/public/catalog/types/{typeSlug}': {
      parameters: [typeSlugParam, localeParam],
      get: {
        tags: ['Public'],
        summary: 'Type with categories, filters and card design',
        operationId: 'getPublicCatalogTypesByTypeSlug',
        responses: {
          '200': jsonResponse('Type', 'CatalogTypePublicResponse'),
          '404': refResponse('NotFound'),
        },
      },
    },
    '/public/catalog/types/{typeSlug}/items': {
      parameters: [
        typeSlugParam,
        localeParam,
        ...paginationParams,
        {
          name: 'category',
          in: 'query',
          schema: { type: 'string' },
          description: 'Category slug(s), comma-separated',
        },
        { name: 'q', in: 'query', schema: { type: 'string' } },
        {
          name: 'sort',
          in: 'query',
          schema: { type: 'string', example: 'price:asc' },
          description: 'order|createdAt|title or an enabled sort spec key',
        },
        {
          name: 'spec.<key>',
          in: 'query',
          schema: { type: 'string' },
          description:
            'select/multiselect: comma-separated values; boolean: true|false; text: contains',
        },
        { name: 'spec.<key>.min', in: 'query', schema: { type: 'number' } },
        { name: 'spec.<key>.max', in: 'query', schema: { type: 'number' } },
      ],
      get: {
        tags: ['Public'],
        summary: 'Published items, filtered by whitelisted specs only',
        operationId: 'getPublicCatalogTypesItemsByTypeSlug',
        responses: {
          '200': jsonResponse('Cards', 'PaginatedCatalogItemCardResponse'),
          '404': refResponse('NotFound'),
        },
      },
    },
    '/public/catalog/types/{typeSlug}/items/{itemSlug}': {
      parameters: [typeSlugParam, itemSlugParam, localeParam],
      get: {
        tags: ['Public'],
        summary: 'One published item with all detail specs',
        operationId: 'getPublicCatalogTypesItemsByTypeSlugByItemSlug',
        responses: {
          '200': jsonResponse('Item', 'CatalogItemPublicResponse'),
          '404': refResponse('NotFound'),
        },
      },
    },
  },
};
