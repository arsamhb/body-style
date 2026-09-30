import 'server-only';
import type { LocaleCode } from '@/i18n/routing';
import { publicFetch } from '@/lib/server/publicApi';
import type { PublicPage } from '@/features/sections/types';
import type { PageKey } from './types';

export const pageTag = (key: PageKey) => `page:${key}`;

/** 404s (disabled page) become Next's notFound() through publicFetch. */
export const getPublicPage = (key: PageKey, locale: LocaleCode): Promise<PublicPage> =>
  publicFetch<PublicPage>(`/public/pages/${key}`, { locale, tags: [pageTag(key), 'settings'] });
