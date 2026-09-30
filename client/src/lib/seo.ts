import type { Metadata } from 'next';
import { routing, type LocaleCode } from '@/i18n/routing';
import { LOCALE_META } from '@/lib/i18n/locales';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  ''
);

/** `/about` → `/about` for the default locale, `/en/about` otherwise (mirrors `as-needed`). */
export const localizedPath = (path: string, locale: LocaleCode): string => {
  const clean = path === '/' ? '' : path;
  return locale === routing.defaultLocale ? clean || '/' : `/${locale}${clean}`;
};

/**
 * Canonical + hreflang alternates for a public path across the enabled locales.
 * `x-default` points at the default locale.
 */
export const alternatesFor = (
  path: string,
  enabledLocales: LocaleCode[],
  current: LocaleCode
): Metadata['alternates'] => {
  const languages: Record<string, string> = {};
  for (const locale of enabledLocales)
    languages[LOCALE_META[locale].bcp47] = `${SITE_URL}${localizedPath(path, locale)}`;
  languages['x-default'] = `${SITE_URL}${localizedPath(path, routing.defaultLocale)}`;
  return { canonical: `${SITE_URL}${localizedPath(path, current)}`, languages };
};
