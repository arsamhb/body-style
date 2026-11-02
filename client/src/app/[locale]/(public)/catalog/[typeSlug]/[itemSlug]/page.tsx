import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { resolveLocale, type LocaleParams } from '@/lib/i18n/params';
import ItemGallery from '@/features/catalog/ItemGallery';
import SpecTable from '@/features/catalog/SpecTable';
import { formatSpecValue } from '@/features/catalog/formatSpec';
import { getCatalogItem } from '@/features/catalog/getPublicCatalog';
import { getPublicSite } from '@/features/site/getPublicSite';
import TicketForm from '@/features/tickets/TicketForm';
import Container from '@/shared/UI/Container';
import IconByName from '@/shared/UI/IconByName';
import Paragraphs from '@/shared/UI/Paragraphs';

type Props = { params: Promise<{ locale: string; typeSlug: string; itemSlug: string }> };

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params as LocaleParams);
  const { typeSlug, itemSlug } = await params;
  const item = await getCatalogItem(typeSlug, itemSlug, locale);
  return {
    title: item.seo.title,
    description: item.seo.description,
    openGraph: {
      title: item.seo.title,
      description: item.seo.description,
      images: item.coverImage ? [item.coverImage] : undefined,
    },
  };
}

export default async function CatalogItemPage({ params }: Props) {
  const locale = await resolveLocale(params as LocaleParams);
  setRequestLocale(locale);
  const { typeSlug, itemSlug } = await params;
  const [item, site, t] = await Promise.all([
    getCatalogItem(typeSlug, itemSlug, locale),
    getPublicSite(locale),
    getTranslations('catalog'),
  ]);
  const labels = { yes: t('yes'), no: t('no') };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    description: item.summary || undefined,
    image: item.images.map((src) => (src.startsWith('http') ? src : `${SITE_URL}${src}`)),
    brand: { '@type': 'Organization', name: site.siteName },
    category: item.categories.map((c) => c.name).join(', ') || undefined,
    ...(item.price && typeof item.price.value === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            price: item.price.value,
            priceCurrency: item.price.currency || undefined,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return (
    <Container size="wide" className="section-py-sm flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="breadcrumb"
        className="flex flex-wrap items-center gap-1 text-caption text-ink-muted"
      >
        <Link href="/" className="hover:text-ink">
          {site.siteName}
        </Link>
        <IconByName name="chevron-right" className="size-3 rtl:-scale-x-100" />
        <Link href={item.type.href} className="hover:text-ink">
          {item.type.name}
        </Link>
        <IconByName name="chevron-right" className="size-3 rtl:-scale-x-100" />
        <span className="text-ink">{item.title}</span>
      </nav>

      <article className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ItemGallery images={item.images} alt={item.title} />
        <div className="flex flex-col gap-6 lg:pt-4">
          <header className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {item.categories.map((c) => (
                <Link
                  key={c.id}
                  href={`${item.type.href}?category=${c.slug}`}
                  className="rounded-xs border border-line bg-surface px-2.5 py-1 text-caption font-bold uppercase tracking-wide text-ink-muted transition-colors hover:border-brand hover:text-brand-strong"
                >
                  {c.name}
                </Link>
              ))}
              {item.badge && (
                <span
                  className={
                    item.badge.type === 'boolean' && !item.badge.value
                      ? 'rounded-pill bg-surface-raised px-2.5 py-0.5 text-caption text-ink-muted'
                      : 'rounded-pill bg-success-soft px-2.5 py-0.5 text-caption text-success'
                  }
                >
                  {item.badge.type === 'boolean'
                    ? item.badge.label
                    : formatSpecValue(item.badge, locale, labels)}
                </span>
              )}
            </div>
            <h1 className="text-display">{item.title}</h1>
            {item.summary && <p className="text-lead text-ink-muted">{item.summary}</p>}
            {item.price && (
              <p className="text-h3 font-semibold tabular-nums">
                {formatSpecValue(item.price, locale, labels)}
              </p>
            )}
          </header>
          {item.description && <Paragraphs text={item.description} className="text-body" />}
          <SpecTable specs={item.specs} locale={locale} />
        </div>
      </article>

      <section
        id="request"
        className="relative grid gap-8 overflow-hidden rounded-xs border border-line bg-canvas-subtle p-6 before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-brand lg:grid-cols-5 lg:gap-12 lg:p-10"
      >
        <div className="flex flex-col gap-3 lg:col-span-2">
          <h2 className="text-h2">{t('askAboutThis')}</h2>
          <p className="text-body text-ink-muted">{t('askAboutThisText', { title: item.title })}</p>
          <Link
            href={item.type.href}
            className="mt-2 inline-flex w-fit items-center gap-1 text-small text-ink-muted link-underline"
          >
            <IconByName name="arrow-left" className="size-4 rtl:-scale-x-100" />
            {t('backToList')}
          </Link>
        </div>
        <div className="lg:col-span-3">
          <TicketForm
            source={{
              page: 'catalogItem',
              section: 'item-request',
              itemId: item.id,
              itemSlug: item.slug,
              itemTitle: item.title,
            }}
          />
        </div>
      </section>
    </Container>
  );
}
