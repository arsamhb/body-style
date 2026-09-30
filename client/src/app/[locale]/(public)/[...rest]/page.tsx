import { notFound } from 'next/navigation';

/**
 * Catch-all so unknown paths (and unknown locale prefixes such as `/de/about`, which the proxy
 * serves under the default locale) render the locale-aware `[locale]/not-found.tsx` instead of
 * Next's bare default 404 page.
 */
export default function CatchAllPage() {
  notFound();
}
