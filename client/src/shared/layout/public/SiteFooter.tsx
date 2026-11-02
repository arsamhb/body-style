import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { LocaleCode } from '@/i18n/routing';
import { contactWayHref, isExternalHref } from '@/features/site/contactWays';
import { filterNavByEnabledPages } from '@/features/site/navigation';
import type { PublicContactWay, PublicSite } from '@/features/site/types';
import Container from '@/shared/UI/Container';
import { ctaClassName } from '@/shared/UI/Cta';
import IconByName from '@/shared/UI/IconByName';
import SiteLogo from './SiteLogo';

interface SiteFooterProps {
  site: PublicSite;
  locale: LocaleCode;
}

const HEADING = 'text-caption font-bold uppercase tracking-[0.2em] text-accent';
const LINK = 'text-small text-ink-muted hover:text-brand-strong link-underline';
const ICON_TILE =
  'grid size-9 shrink-0 place-items-center rounded-xs border border-line bg-surface text-accent icon-hover';

const external = (href: string) =>
  href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {};

const SiteFooter = async ({ site, locale }: SiteFooterProps) => {
  const t = await getTranslations('footer');
  const year = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(new Date());
  const quickLinks = filterNavByEnabledPages(site.footer.quickLinks, site.enabledPages);

  const ways = site.contactWays.filter((w) => w.showInFooter);
  const phones = ways.filter((w) => w.type === 'phone');
  const emails = ways.filter((w) => w.type === 'email');
  const addresses = ways.filter((w) => w.type === 'address');
  const hours = ways.filter((w) => w.type === 'hours');
  const socials = ways.filter((w) => !['phone', 'email', 'address', 'hours'].includes(w.type));

  const callHref = phones[0] ? contactWayHref(phones[0]) : null;
  const availability = hours.find((w) => w.description)?.description;

  const renderWay = (way: PublicContactWay) => {
    const href = contactWayHref(way);
    const inner = (
      <>
        <span className={ICON_TILE}>
          <IconByName name={way.icon} className="size-4" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-caption text-ink-subtle">{way.label}</span>
          <span
            className="text-small text-ink"
            dir={way.type === 'address' || way.type === 'hours' ? undefined : 'ltr'}
          >
            {way.value}
          </span>
        </span>
      </>
    );
    return href ? (
      <a href={href} className="group flex items-start gap-3" {...external(href)}>
        {inner}
      </a>
    ) : (
      <div className="flex items-start gap-3">{inner}</div>
    );
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-brand/40 bg-surface-sunken">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand via-accent to-transparent" />
      <div
        aria-hidden
        className="absolute -end-20 top-40 size-72 rotate-12 border-[32px] border-line/30"
      />

      {(availability || callHref) && (
        <div className="relative border-b border-line bg-canvas/60">
          <Container
            size="wide"
            className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="icon-tile size-12 shrink-0">
                <IconByName name="clock" className="size-6" strokeWidth={1.75} />
              </span>
              {availability && <p className="text-h4 text-ink">{availability}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              {callHref && (
                <a href={callHref} className={ctaClassName('primary', 'md')}>
                  <IconByName name="phone" className="size-4" />
                  <span>{t('callUs')}</span>
                </a>
              )}
            </div>
          </Container>
        </div>
      )}

      <Container
        size="wide"
        className="section-py-sm relative grid gap-10 sm:grid-cols-2 lg:grid-cols-12"
      >
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
          <SiteLogo site={site} className="w-fit" />
          {site.footer.text && (
            <p className="max-w-md text-small text-ink-muted">{site.footer.text}</p>
          )}
          {site.slogan && (
            <p className="mt-2 max-w-md border-s-2 border-brand ps-4 text-h4 text-ink">
              {site.slogan}
            </p>
          )}
          {socials.length > 0 && (
            <ul className="mt-2 flex gap-2" role="list">
              {socials.map((way) => {
                const href = contactWayHref(way);
                return (
                  <li key={way.id}>
                    {href ? (
                      <a
                        href={href}
                        aria-label={way.label}
                        className={ICON_TILE}
                        {...external(href)}
                      >
                        <IconByName name={way.icon} className="size-4" />
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <nav aria-labelledby="footer-quick" className="flex flex-col gap-4 lg:col-span-2">
          <h2 id="footer-quick" className={HEADING}>
            {t('quickLinks')}
          </h2>
          <ul className="flex flex-col gap-2.5" role="list">
            {quickLinks.map((link) => (
              <li key={link.id}>
                {isExternalHref(link.href) ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className={LINK}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <h2 className={HEADING}>{t('phones')}</h2>
          <ul className="flex flex-col gap-3" role="list">
            {[...phones, ...emails].map((way) => (
              <li key={way.id}>{renderWay(way)}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-3">
          <h2 className={HEADING}>{t('visit')}</h2>
          <ul className="flex flex-col gap-3" role="list">
            {[...addresses, ...hours].map((way) => (
              <li key={way.id}>{renderWay(way)}</li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-line bg-canvas/50">
        <Container
          size="wide"
          className="flex flex-col gap-2 py-5 text-caption text-ink-subtle lg:flex-row lg:items-center lg:justify-between"
        >
          <span>
            © {year} {site.footer.copyright}. {t('allRightsReserved')}
          </span>
          <span className="max-w-2xl lg:text-end">{t('legalNotice')}</span>
        </Container>
      </div>

      <div className="border-t border-line/60 bg-canvas/80">
        <Container size="wide" className="flex justify-center py-3 text-caption text-ink-subtle">
          <p className="flex items-center gap-2">
            <span aria-hidden className="h-px w-6 bg-gradient-to-r from-transparent to-accent" />
            <span>
              {t.rich('developedBy', {
                link: (chunks) => (
                  <a
                    href="https://vervedevlab.ir/"
                    target="_blank"
                    rel="noopener"
                    title={t('developerTitle')}
                    className="font-bold text-ink-muted hover:text-brand-strong link-underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </span>
            <span aria-hidden className="h-px w-6 bg-gradient-to-l from-transparent to-accent" />
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default SiteFooter;
