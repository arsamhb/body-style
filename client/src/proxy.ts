import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next 16 renamed `middleware.ts` to `proxy.ts`. next-intl detects the locale and applies the
// `as-needed` prefix strategy (default locale unprefixed, others prefixed).
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and any path with a file extension (fonts, images, sitemap.xml…).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
