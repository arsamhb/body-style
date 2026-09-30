import type { MetadataRoute } from 'next';
import { routing, type LocaleCode } from '@/i18n/routing';
import { LOCALE_META } from '@/lib/i18n/locales';
import { localizedPath, SITE_URL } from '@/lib/seo';

interface SitemapPayload {
  enabledLocales: LocaleCode[];
  pages: { key: string; path: string; updatedAt: string }[];
  types: { slug: string; updatedAt: string }[];
  items: { typeSlug: string; slug: string; updatedAt: string }[];
}

// Rendered per request (the API is not reachable during `next build`); the fetch itself is cached.
export const dynamic = 'force-dynamic';

const API_URL = (
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  'http://localhost:4000'
).replace(/\/$/, '');

/** Every enabled page, catalog type and published item, once per enabled locale with hreflang. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data: SitemapPayload;
  try {
    const res = await fetch(`${API_URL}/public/sitemap`, {
      next: { revalidate: 3600, tags: ['settings', 'catalog:items'] },
    });
    if (!res.ok) throw new Error(String(res.status));
    data = (await res.json()) as SitemapPayload;
  } catch {
    return [{ url: SITE_URL, lastModified: new Date() }];
  }
  const locales = data.enabledLocales.length ? data.enabledLocales : [routing.defaultLocale];
  const entry = (path: string, updatedAt: string, priority: number): MetadataRoute.Sitemap =>
    locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(path, locale)}`,
      lastModified: new Date(updatedAt),
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [LOCALE_META[l].bcp47, `${SITE_URL}${localizedPath(path, l)}`])
        ),
      },
    }));
  return [
    ...data.pages.flatMap((p) => entry(p.path, p.updatedAt, p.key === 'landing' ? 1 : 0.8)),
    ...data.types.flatMap((t) => entry(`/catalog/${t.slug}`, t.updatedAt, 0.7)),
    ...data.items.flatMap((i) => entry(`/catalog/${i.typeSlug}/${i.slug}`, i.updatedAt, 0.6)),
  ];
}
