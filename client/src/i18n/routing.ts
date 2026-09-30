import { defineRouting } from 'next-intl/routing';

/**
 * Superset of locales the code base knows how to render (messages + font + direction).
 * Which of them are actually enabled for a deployment is decided in the admin panel
 * (SiteSettings.enabledLocales) — see `[locale]/layout.tsx`.
 * Adding a language: add it here, add `messages/<code>.json`, add its meta in `lib/i18n/locales.ts`.
 */
export const SUPPORTED_LOCALES = ['fa', 'en'] as const;
export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

const envDefault = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
export const DEFAULT_LOCALE: LocaleCode = (SUPPORTED_LOCALES as readonly string[]).includes(
  envDefault ?? ''
)
  ? (envDefault as LocaleCode)
  : 'fa';

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // Default locale lives at `/`, other locales are prefixed (`/en/about`).
  localePrefix: 'as-needed',
  // The URL is the only source of truth: no Accept-Language / cookie redirects (SEO-friendly,
  // and a Farsi-first site should not bounce Farsi visitors with English browsers to /en).
  localeDetection: false,
});
