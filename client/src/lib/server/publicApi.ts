import 'server-only';
import { notFound } from 'next/navigation';
import type { LocaleCode } from '@/i18n/routing';

/**
 * Server-side fetch for `/public/*` endpoints. Uses the internal API URL (Docker network) and
 * the Next.js Data Cache: entries are tagged so the API can invalidate them on writes
 * (`POST /api/revalidate`) and still expire on their own after `revalidate` seconds.
 */
const API_URL = (
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  'http://localhost:4000'
).replace(/\/$/, '');

export class PublicApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

interface PublicFetchOptions {
  locale: LocaleCode;
  tags: string[];
  revalidate?: number;
  searchParams?: Record<string, string | undefined>;
  /** Throw Next's notFound() on 404 instead of a PublicApiError. */
  notFoundOn404?: boolean;
}

export async function publicFetch<T>(
  path: string,
  { locale, tags, revalidate = 300, searchParams = {}, notFoundOn404 = true }: PublicFetchOptions
): Promise<T> {
  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set('locale', locale);
  for (const [k, v] of Object.entries(searchParams)) {
    if (v !== undefined && v !== '') url.searchParams.set(k, v);
  }
  const res = await fetch(url, {
    next: { tags, revalidate },
    headers: { accept: 'application/json' },
  });
  if (res.status === 404 && notFoundOn404) notFound();
  if (!res.ok) throw new PublicApiError(res.status, `${path} → ${res.status}`);
  return (await res.json()) as T;
}
