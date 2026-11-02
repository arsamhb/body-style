import {
  bearer,
  jsonBody,
  jsonResponse,
  localeParam,
  ref,
  refResponse,
} from '../common';

const navItem = {
  type: 'object',
  required: ['label', 'href'],
  properties: {
    id: { type: 'string', description: 'Stable id; generated when omitted' },
    label: ref('LocalizedString'),
    href: {
      type: 'string',
      example: '/about',
      description: 'Relative path or http(s) URL',
    },
    order: { type: 'integer' },
    enabled: { type: 'boolean' },
  },
};

const contactWay = {
  type: 'object',
  required: ['type', 'label', 'value'],
  properties: {
    id: { type: 'string' },
    type: {
      type: 'string',
      enum: [
        'phone',
        'email',
        'link',
        'address',
        'whatsapp',
        'telegram',
        'instagram',
        'hours',
      ],
    },
    icon: { type: 'string', example: 'phone' },
    label: ref('LocalizedString'),
    value: { type: 'string', example: '+98 21 1234 5678' },
    description: ref('LocalizedString'),
    showInFooter: { type: 'boolean' },
    order: { type: 'integer' },
  },
};

const patchResponses = {
  '200': jsonResponse('Updated settings', 'SettingsAdminReadResponse'),
  '400': refResponse('ValidationError'),
  '401': refResponse('Unauthorized'),
  '403': refResponse('Forbidden'),
};

export const settingsDocs = {
  tags: [
    {
      name: 'Settings',
      description:
        'Site-wide settings singleton (branding, navigation, contact, SEO, locales)',
    },
    {
      name: 'Public',
      description: 'Unauthenticated, locale-resolved content for the web app',
    },
  ],
  schemas: {
    NavItem: navItem,
    ContactWay: contactWay,
    SettingsAdminReadResponse: {
      type: 'object',
      properties: {
        siteName: ref('LocalizedString'),
        slogan: ref('LocalizedString'),
        logoUrl: { type: 'string' },
        logoDarkUrl: { type: 'string' },
        faviconUrl: { type: 'string' },
        defaultLocale: { type: 'string', example: 'fa' },
        enabledLocales: { type: 'array', items: { type: 'string' } },
        supportedLocales: { type: 'array', items: { type: 'string' } },
        navbar: { type: 'array', items: ref('NavItem') },
        footer: {
          type: 'object',
          properties: {
            quickLinks: { type: 'array', items: ref('NavItem') },
            text: ref('LocalizedString'),
            copyright: ref('LocalizedString'),
          },
        },
        contactWays: { type: 'array', items: ref('ContactWay') },
        seo: {
          type: 'object',
          properties: {
            titleTemplate: ref('LocalizedString'),
            description: ref('LocalizedString'),
            ogImageUrl: { type: 'string' },
          },
        },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
    SettingsBrandingUpdatePayload: {
      type: 'object',
      properties: {
        siteName: ref('LocalizedString'),
        slogan: ref('LocalizedString'),
        logoUrl: { type: 'string' },
        logoDarkUrl: { type: 'string' },
        faviconUrl: { type: 'string' },
      },
    },
    SettingsNavigationUpdatePayload: {
      type: 'object',
      properties: {
        navbar: { type: 'array', items: ref('NavItem') },
        footer: {
          type: 'object',
          properties: {
            quickLinks: { type: 'array', items: ref('NavItem') },
            text: ref('LocalizedString'),
            copyright: ref('LocalizedString'),
          },
        },
      },
    },
    SettingsContactUpdatePayload: {
      type: 'object',
      required: ['contactWays'],
      properties: { contactWays: { type: 'array', items: ref('ContactWay') } },
    },
    SettingsSeoUpdatePayload: {
      type: 'object',
      properties: {
        titleTemplate: ref('LocalizedString'),
        description: ref('LocalizedString'),
        ogImageUrl: { type: 'string' },
      },
    },
    SettingsLocalesUpdatePayload: {
      type: 'object',
      required: ['enabledLocales'],
      properties: {
        enabledLocales: {
          type: 'array',
          items: { type: 'string' },
          example: ['fa', 'en'],
        },
      },
    },
    SitePublicReadResponse: {
      type: 'object',
      description: 'Locale-resolved site chrome for the web app',
      properties: {
        siteName: { type: 'string' },
        slogan: { type: 'string' },
        logoUrl: { type: 'string' },
        defaultLocale: { type: 'string' },
        enabledLocales: { type: 'array', items: { type: 'string' } },
        navbar: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              href: { type: 'string' },
            },
          },
        },
        footer: { type: 'object' },
        contactWays: { type: 'array', items: { type: 'object' } },
        seo: { type: 'object' },
        enabledPages: { type: 'array', items: { type: 'string' } },
      },
    },
  },
  paths: {
    '/admin/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Read all settings (full localized maps)',
        operationId: 'getAdminSettings',
        security: bearer,
        responses: {
          '200': jsonResponse('Settings', 'SettingsAdminReadResponse'),
          '401': refResponse('Unauthorized'),
        },
      },
    },
    '/admin/settings/branding': {
      patch: {
        tags: ['Settings'],
        summary: 'Name, slogan, logos (permission: settings.branding)',
        operationId: 'patchAdminSettingsBranding',
        security: bearer,
        requestBody: jsonBody('SettingsBrandingUpdatePayload'),
        responses: patchResponses,
      },
    },
    '/admin/settings/navigation': {
      patch: {
        tags: ['Settings'],
        summary: 'Navbar and footer links (permission: settings.navigation)',
        operationId: 'patchAdminSettingsNavigation',
        security: bearer,
        requestBody: jsonBody('SettingsNavigationUpdatePayload'),
        responses: patchResponses,
      },
    },
    '/admin/settings/contact': {
      patch: {
        tags: ['Settings'],
        summary: 'Contact ways (permission: settings.contact)',
        operationId: 'patchAdminSettingsContact',
        security: bearer,
        requestBody: jsonBody('SettingsContactUpdatePayload'),
        responses: patchResponses,
      },
    },
    '/admin/settings/seo': {
      patch: {
        tags: ['Settings'],
        summary: 'SEO defaults (permission: settings.seo)',
        operationId: 'patchAdminSettingsSeo',
        security: bearer,
        requestBody: jsonBody('SettingsSeoUpdatePayload'),
        responses: patchResponses,
      },
    },
    '/admin/settings/locales': {
      patch: {
        tags: ['Settings'],
        summary:
          'Enabled locales (developer only; default locale must stay enabled)',
        operationId: 'patchAdminSettingsLocales',
        security: bearer,
        requestBody: jsonBody('SettingsLocalesUpdatePayload'),
        responses: patchResponses,
      },
    },
    '/public/sitemap': {
      get: {
        tags: ['Public'],
        summary:
          'Enabled pages, catalog types and published items for sitemap.xml',
        operationId: 'getPublicSitemap',
        responses: {
          '200': {
            description: 'Sitemap payload',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/public/site': {
      get: {
        tags: ['Public'],
        summary:
          'Site chrome: name, navigation, footer, contact ways, enabled locales/pages',
        operationId: 'getPublicSite',
        parameters: [localeParam],
        responses: {
          '200': jsonResponse(
            'Resolved site settings',
            'SitePublicReadResponse',
          ),
        },
      },
    },
  },
};
