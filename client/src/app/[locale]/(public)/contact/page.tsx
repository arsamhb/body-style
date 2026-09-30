import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { resolveLocale, type LocaleParams } from '@/lib/i18n/params';
import { SectionRenderer } from '@/features/sections/registry';
import { getPublicSite } from '@/features/site/getPublicSite';
import { getPublicPage } from '@/features/site/getPublicPage';
import { alternatesFor } from '@/lib/seo';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const [page, site] = await Promise.all([getPublicPage('contact', locale), getPublicSite(locale)]);
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: alternatesFor('/contact', site.enabledLocales, locale),
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      images: page.seo.ogImageUrl ? [page.seo.ogImageUrl] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const site = await getPublicSite(locale);
  const page = await getPublicPage('contact', locale);
  return <SectionRenderer sections={page.sections} site={site} locale={locale} page={page.key} />;
}
