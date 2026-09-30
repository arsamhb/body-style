'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';
import { useGetAdminDashboard } from '@/app/_service/tickets/hook.query';
import IconByName from '@/shared/UI/IconByName';
import { ADMIN_NAV } from './adminNav';
import { useCan } from './Can';
import PageHeader from './ui/PageHeader';

const Stat = ({
  icon,
  label,
  value,
  href,
  tone,
}: {
  icon: string;
  label: string;
  value: number | undefined;
  href?: string;
  tone?: 'brand';
}) => {
  const body = (
    <>
      <span
        className={
          tone === 'brand' ? 'icon-tile bg-brand text-brand-ink border-transparent' : 'icon-tile'
        }
      >
        <IconByName name={icon} className="size-5" />
      </span>
      <div className="flex flex-col">
        <span className="text-h2 font-semibold tabular-nums leading-none">{value ?? '—'}</span>
        <span className="mt-1 text-small text-ink-muted">{label}</span>
      </div>
    </>
  );
  const cls = 'flex items-center gap-4 rounded-lg border border-line bg-surface p-5';
  return href ? (
    <Link href={href} className={`${cls} card-hover`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
};

const AdminDashboard = () => {
  const t = useTranslations('admin');
  const { me } = useAuth();
  const can = useCan();
  const { data } = useGetAdminDashboard();
  const links = ADMIN_NAV.filter((i) => i.key !== 'dashboard' && can(i));

  return (
    <>
      <PageHeader
        title={t('dashboard.welcome', { name: me?.displayName || me?.email || '' })}
        subtitle={me ? t('dashboard.roleHint', { role: t(`roles.${me.role}`) }) : undefined}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {can({ permission: 'tickets.read' }) && (
          <Stat
            icon="inbox"
            label={t('dashboard.newTickets')}
            value={data?.tickets.new}
            href="/admin/tickets"
            tone="brand"
          />
        )}
        {can({ permission: 'tickets.read' }) && (
          <Stat
            icon="clock"
            label={t('dashboard.inProgressTickets')}
            value={data?.tickets.inProgress}
            href="/admin/tickets"
          />
        )}
        {can({ anyOf: ['catalog.items', 'catalog.categories'] }) && (
          <Stat
            icon="package"
            label={t('dashboard.publishedItems')}
            value={data?.catalog.published}
            href="/admin/catalog/items"
          />
        )}
        {can({ anyOf: ['pages.landing', 'pages.about', 'pages.contact', 'pages.catalog'] }) && (
          <Stat
            icon="file-text"
            label={t('dashboard.enabledPages')}
            value={data?.pages.enabled}
            href="/admin/pages"
          />
        )}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-subtle">
          {t('dashboard.quickLinks')}
        </h2>
        {links.length === 0 ? (
          <p className="text-small text-ink-muted">{t('dashboard.intro')}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="list">
            {links.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 card-hover"
                >
                  <span className="icon-tile">
                    <IconByName name={item.icon} className="size-5" />
                  </span>
                  <span className="text-body font-medium">{t(`nav.${item.key}`)}</span>
                  <IconByName
                    name="arrow-right"
                    className="ms-auto size-4 text-ink-subtle rtl:-scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default AdminDashboard;
