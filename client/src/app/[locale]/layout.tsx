import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '@/globals.css';
import { routing, type LocaleCode } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { LOCALE_META } from '@/lib/i18n/locales';
import QueryProvider from '@/lib/QueryProvider';
import { NotificationProvider } from '@/lib/notification/NotificationProvider';
import { getPublicSite } from '@/features/site/getPublicSite';

// Content comes from the API at request time; never prerender at build.
export const dynamic = 'force-dynamic';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const site = await getPublicSite(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.siteName, template: site.seo.titleTemplate || `%s | ${site.siteName}` },
    description: site.seo.description,
    openGraph: { siteName: site.siteName, locale: LOCALE_META[locale].bcp47, type: 'website' },
  };
}

/** Applied before paint; mirrors `useTheme`. Values: 'light' | 'dark'. */
const THEME_INIT = `(function(){try{var s=localStorage.getItem('theme');var t=s==='dark'||s==='light'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const meta = LOCALE_META[locale as LocaleCode];

  return (
    <html lang={locale} dir={meta.dir} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <QueryProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
