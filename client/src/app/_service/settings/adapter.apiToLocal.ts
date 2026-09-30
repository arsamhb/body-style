import type { AdminSettingsReadResponse } from './interface.response';
import type { SettingsSchema } from './interface.schema';

export const adminSettingsReadResponse2SettingsSchema = (
  api: AdminSettingsReadResponse
): SettingsSchema => ({
  siteName: api.siteName ?? {},
  slogan: api.slogan ?? {},
  logoUrl: api.logoUrl ?? '',
  logoDarkUrl: api.logoDarkUrl ?? '',
  faviconUrl: api.faviconUrl ?? '',
  defaultLocale: api.defaultLocale,
  enabledLocales: api.enabledLocales ?? [],
  supportedLocales: api.supportedLocales ?? [],
  navbar: api.navbar ?? [],
  footer: {
    quickLinks: api.footer?.quickLinks ?? [],
    text: api.footer?.text ?? {},
    copyright: api.footer?.copyright ?? {},
  },
  contactWays: api.contactWays ?? [],
  seo: {
    titleTemplate: api.seo?.titleTemplate ?? {},
    description: api.seo?.description ?? {},
    ogImageUrl: api.seo?.ogImageUrl ?? '',
  },
  updatedAt: new Date(api.updatedAt),
});
