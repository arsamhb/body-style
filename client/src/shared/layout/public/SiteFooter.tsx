import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { LocaleCode } from '@/i18n/routing';
import { contactWayHref, isExternalHref } from '@/features/site/contactWays';
import { filterNavByEnabledPages } from '@/features/site/navigation';
import type { PublicSite } from '@/features/site/types';
import Container from '@/shared/UI/Container';
import IconByName from '@/shared/UI/IconByName';
import SiteLogo from './SiteLogo';

interface SiteFooterProps {
  site: PublicSite;
  locale: LocaleCode;
}

const SiteFooter = async ({ site, locale }: SiteFooterProps) => {
  const t = await getTranslations('footer');
  const year = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(new Date());
  const contactWays = site.contactWays.filter((w) => w.showInFooter);
  const quickLinks = filterNavByEnabledPages(site.footer.quickLinks, site.enabledPages);

  return (
    <footer className="mt-auto border-t border-line bg-canvas-subtle">
      <Container size="wide" className="section-py-sm grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <SiteLogo site={site} className="w-fit" />
          <p className="max-w-md text-small text-ink-muted">{site.footer.text}</p>
        </div>

        <nav aria-labelledby="footer-quick" className="flex flex-col gap-3">
          <h2
            id="footer-quick"
            className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-subtle"
          >
            {t('quickLinks')}
          </h2>
          <ul className="flex flex-col gap-2" role="list">
            {quickLinks.map((link) => (
              <li key={link.id}>
                {isExternalHref(link.href) ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small text-ink-muted hover:text-ink link-underline"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-small text-ink-muted hover:text-ink link-underline"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            {t('contact')}
          </h2>
          <ul className="flex flex-col gap-3" role="list">
            {contactWays.map((way) => {
              const href = contactWayHref(way);
              const inner = (
                <>
                  <span className="grid size-8 shrink-0 place-items-center rounded-sm border border-line bg-surface text-ink-muted icon-hover">
                    <IconByName name={way.icon} className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-caption text-ink-subtle">{way.label}</span>
                    <span
                      className="text-small text-ink"
                      dir={way.type === 'address' ? undefined : 'ltr'}
                    >
                      {way.value}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={way.id}>
                  {href ? (
                    <a
                      href={href}
                      className="group flex items-center gap-3"
                      {...(href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container
          size="wide"
          className="flex flex-col gap-2 py-5 text-caption text-ink-subtle sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            © {year} {site.footer.copyright}. {t('allRightsReserved')}
          </span>
        </Container>
      </div>
    </footer>
  );
};

export default SiteFooter;
