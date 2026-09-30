import 'server-only';
import type { LocaleCode } from '@/i18n/routing';
import { publicFetch } from '@/lib/server/publicApi';
import type {
  CatalogItemDetail,
  CatalogItemsPage,
  CatalogTypePublic,
  CatalogTypeSummary,
} from './types';

export const CATALOG_TAGS = {
  types: 'catalog:types',
  type: (slug: string) => `catalog:type:${slug}`,
  items: 'catalog:items',
  item: (slug: string) => `catalog:item:${slug}`,
};

export const getCatalogTypes = (locale: LocaleCode) =>
  publicFetch<CatalogTypeSummary[]>('/public/catalog/types', {
    locale,
    tags: [CATALOG_TAGS.types],
  });

export const getCatalogType = (slug: string, locale: LocaleCode) =>
  publicFetch<CatalogTypePublic>(`/public/catalog/types/${encodeURIComponent(slug)}`, {
    locale,
    tags: [CATALOG_TAGS.types, CATALOG_TAGS.type(slug)],
  });

/** Forwards only listing-related query params to the API (it re-validates every one). */
export const pickListingParams = (searchParams: Record<string, string | string[] | undefined>) => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(searchParams)) {
    const value = Array.isArray(v) ? v[0] : v;
    if (typeof value !== 'string' || !value) continue;
    if (
      k === 'category' ||
      k === 'q' ||
      k === 'sort' ||
      k === 'limit' ||
      k === 'offset' ||
      k.startsWith('spec.')
    )
      out[k] = value;
  }
  return out;
};

export const getCatalogItems = (slug: string, locale: LocaleCode, params: Record<string, string>) =>
  publicFetch<CatalogItemsPage>(`/public/catalog/types/${encodeURIComponent(slug)}/items`, {
    locale,
    tags: [CATALOG_TAGS.type(slug), CATALOG_TAGS.items],
    searchParams: params,
    revalidate: 120,
  });

export const getCatalogItem = (typeSlug: string, itemSlug: string, locale: LocaleCode) =>
  publicFetch<CatalogItemDetail>(
    `/public/catalog/types/${encodeURIComponent(typeSlug)}/items/${encodeURIComponent(itemSlug)}`,
    { locale, tags: [CATALOG_TAGS.type(typeSlug), CATALOG_TAGS.item(itemSlug)] }
  );
