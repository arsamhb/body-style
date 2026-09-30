import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Uploaded media is served by the API under `/uploads`. The web app proxies that path so images
 * are same-origin (next/image optimisation, CSP, SEO) and so the browser never needs the API's
 * internal Docker hostname. Both values are inlined at build time.
 */
const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [{ source: '/uploads/:path*', destination: `${API_INTERNAL_URL}/uploads/:path*` }];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
