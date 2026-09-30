import { getTranslations } from 'next-intl/server';
import type { LocaleCode } from '@/i18n/routing';
import { filterNavByEnabledPages } from '@/features/site/navigation';
import type { PublicSite } from '@/features/site/types';
import Container from '@/shared/UI/Container';
import Cta from '@/shared/UI/Cta';
import LocaleSwitcher from './LocaleSwitcher';
import MobileNav from './MobileNav';
import NavLinks from './NavLinks';
import SiteLogo from './SiteLogo';
import ThemeToggle from './ThemeToggle';

interface SiteHeaderProps {
  site: PublicSite;
  locale: LocaleCode;
}

const SiteHeader = async ({ site }: SiteHeaderProps) => {
  const t = await getTranslations();
  const navItems = filterNavByEnabledPages(site.navbar, site.enabledPages);
  return (
    <header
      className="sticky top-0 z-50 border-b border-line/80 bg-canvas/80 backdrop-blur-md [--header-h:4rem] lg:[--header-h:4.5rem]"
      style={{ height: 'var(--header-h)' }}
    >
      <Container size="wide" className="flex h-full items-center justify-between gap-6">
        <SiteLogo site={site} className="shrink-0" />
        <nav aria-label={t('nav.mainNavigation')} className="hidden lg:block">
          <NavLinks items={navItems} />
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <LocaleSwitcher locales={site.enabledLocales} />
          <ThemeToggle />
          <Cta href="/contact" size="sm" icon="arrow-right" className="ms-2">
            {t('common.contactUs')}
          </Cta>
        </div>
        <MobileNav
          items={navItems}
          locales={site.enabledLocales}
          ctaLabel={t('common.contactUs')}
        />
      </Container>
    </header>
  );
};

export default SiteHeader;
