import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { resolveLocale, type LocaleParams } from '@/lib/i18n/params';
import CatalogFilters from '@/features/catalog/CatalogFilters';
import CatalogGrid from '@/features/catalog/CatalogGrid';
import CatalogPagination from '@/features/catalog/CatalogPagination';
import {
  getCatalogItems,
  getCatalogType,
  pickListingParams,
} from '@/features/catalog/getPublicCatalog';
import Container from '@/shared/UI/Container';
import IconByName from '@/shared/UI/IconByName';

type Props = {
  params: Promise<{ locale: string; typeSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params as LocaleParams);
  const { typeSlug } = await params;
  const type = await getCatalogType(typeSlug, locale);
  return {
    title: type.seo.title || type.name,
    description: type.seo.description || type.description,
  };
}

export default async function CatalogTypePage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params as LocaleParams);
  setRequestLocale(locale);
  const { typeSlug } = await params;
  const listing = pickListingParams(await searchParams);
  const [type, page, t] = await Promise.all([
    getCatalogType(typeSlug, locale),
    getCatalogItems(typeSlug, locale, listing),
    getTranslations('catalog'),
  ]);
  const labels = { yes: t('yes'), no: t('no') };

  return (
    <Container size="wide" className="section-py-sm flex flex-col gap-10">
      <header className="relative flex flex-col gap-4 overflow-hidden border border-line bg-canvas-subtle px-6 py-10 md:px-10 md:py-14">
        <div className="absolute inset-y-0 start-0 w-1 bg-brand" />
        <div className="absolute -end-16 -top-20 size-56 rotate-12 border-[24px] border-line/40" />
        <span className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-8 bg-accent" />
          Body Style
        </span>
        <h1 className="text-display">{type.name}</h1>
        {type.description && (
          <p className="max-w-3xl text-lead text-ink-muted">{type.description}</p>
        )}
      </header>
      <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <CatalogFilters type={type} total={page.total} />
        </div>
        <div className="flex flex-col gap-8">
          {page.data.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xs border border-dashed border-line-strong p-12 text-center">
              <IconByName name="search" className="size-8 text-ink-subtle" />
              <p className="text-body text-ink-muted">{t('noResults')}</p>
            </div>
          ) : (
            <CatalogGrid
              items={page.data}
              design={type.cardDesign}
              locale={locale}
              labels={labels}
            />
          )}
          <CatalogPagination total={page.total} limit={page.limit} offset={page.offset} />
        </div>
      </div>
    </Container>
  );
}
