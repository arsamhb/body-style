import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing, type LocaleCode } from '@/i18n/routing';

/** Shape Next.js passes to layouts/pages under `app/[locale]`. */
export type LocaleParams = Promise<{ locale: string }>;

/** Awaits the route params and narrows the locale, rendering 404 for anything unsupported. */
export const resolveLocale = async (params: LocaleParams): Promise<LocaleCode> => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
};
