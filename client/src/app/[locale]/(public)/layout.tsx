import { getTranslations, setRequestLocale } from 'next-intl/server';
import { resolveLocale, type LocaleParams } from '@/lib/i18n/params';
import { getPublicSite } from '@/features/site/getPublicSite';
import { notFound } from 'next/navigation';
import SiteFooter from '@/shared/layout/public/SiteFooter';
import SiteHeader from '@/shared/layout/public/SiteHeader';
import { contactWayHref } from '@/features/site/contactWays';
import { SITE_URL } from '@/lib/seo';

type Props = { children: React.ReactNode; params: LocaleParams };

export default async function PublicLayout({ children, params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const t = await getTranslations('common');
  const site = await getPublicSite(locale);
  // Locales the developer disabled in the panel 404 even though the code supports them.
  if (!site.enabledLocales.includes(locale)) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.siteName,
    url: SITE_URL,
    ...(site.logoUrl
      ? { logo: site.logoUrl.startsWith('http') ? site.logoUrl : `${SITE_URL}${site.logoUrl}` }
      : {}),
    ...(site.slogan ? { slogan: site.slogan } : {}),
    contactPoint: site.contactWays
      .filter((w) => w.type === 'phone' || w.type === 'email')
      .map((w) => ({
        '@type': 'ContactPoint',
        contactType: 'customer service',
        [w.type === 'phone' ? 'telephone' : 'email']: w.value,
      })),
    sameAs: site.contactWays
      .filter((w) => w.type === 'instagram' || w.type === 'telegram' || w.type === 'link')
      .map((w) => contactWayHref(w))
      .filter((h): h is string => Boolean(h)),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a href="#content" className="skip-link">
        {t('skipToContent')}
      </a>
      <SiteHeader site={site} locale={locale} />
      <main id="content">{children}</main>
      <SiteFooter site={site} locale={locale} />
    </>
  );
}
