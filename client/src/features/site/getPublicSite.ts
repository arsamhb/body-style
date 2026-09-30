import 'server-only';
import type { LocaleCode } from '@/i18n/routing';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { publicFetch } from '@/lib/server/publicApi';
import type { PublicSite } from './types';

export const SITE_TAG = 'settings';

/** Minimal chrome so the public site still renders when the API is unreachable. */
const fallbackSite = (locale: LocaleCode): PublicSite => ({
  siteName: locale === 'fa' ? 'وب‌سایت' : 'Website',
  slogan: '',
  defaultLocale: DEFAULT_LOCALE,
  enabledLocales: [DEFAULT_LOCALE],
  navbar: [],
  footer: { quickLinks: [], text: '', copyright: '' },
  contactWays: [],
  seo: { titleTemplate: '%s', description: '' },
  enabledPages: ['landing', 'about', 'contact', 'catalog'],
});

/** Cached per request by Next's fetch dedupe; invalidated by the `settings` tag. */
export const getPublicSite = async (locale: LocaleCode): Promise<PublicSite> => {
  try {
    return await publicFetch<PublicSite>('/public/site', {
      locale,
      tags: [SITE_TAG],
      notFoundOn404: false,
    });
  } catch (err) {
    console.error('[public site] falling back to minimal chrome:', (err as Error).message);
    return fallbackSite(locale);
  }
};
