import { getTranslations } from 'next-intl/server';
import type { LocaleCode } from '@/i18n/routing';
import { filterNavByEnabledPages } from '@/features/site/navigation';
import type { PublicSite } from '@/features/site/types';
import Container from '@/shared/UI/Container';
import Cta from '@/shared/UI/Cta';
import MobileNav from './MobileNav';
import NavLinks from './NavLinks';
import SiteLogo from './SiteLogo';

interface SiteHeaderProps {
  site: PublicSite;
  locale: LocaleCode;
}

const SiteHeader = async ({ site }: SiteHeaderProps) => {
  const t = await getTranslations();
  const navItems = filterNavByEnabledPages(site.navbar, site.enabledPages);
  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-canvas/88 backdrop-blur-xl [--header-h:4.25rem] lg:[--header-h:5rem]"
      style={{ height: 'var(--header-h)' }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/80 to-transparent" />
      <Container size="wide" className="flex h-full items-center justify-between gap-8">
        <SiteLogo site={site} className="shrink-0 transition-opacity hover:opacity-80" />
        <nav aria-label={t('nav.mainNavigation')} className="hidden lg:block">
          <NavLinks items={navItems} />
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Cta href="/contact" size="sm" icon="arrow-right">
            {t('common.contactUs')}
          </Cta>
        </div>
        <MobileNav items={navItems} ctaLabel={t('common.contactUs')} />
      </Container>
    </header>
  );
};

export default SiteHeader;
