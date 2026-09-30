'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';
import IconByName from '@/shared/UI/IconByName';
import { useGetAdminDashboard } from '@/app/_service/tickets/hook.query';
import { ADMIN_NAV, ADMIN_NAV_FOOTER, type AdminNavItem } from './adminNav';
import { useCan } from './Can';

interface SidebarProps {
  onNavigate?: () => void;
}

const isActive = (pathname: string, href: string) =>
  href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`);

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const can = useCan();
  const { me } = useAuth();
  const { data: dashboard } = useGetAdminDashboard({
    options: { enabled: can({ permission: 'tickets.read' }) },
  });

  const renderItem = (item: AdminNavItem) => {
    if (!can(item)) return null;
    const active = isActive(pathname, item.href);
    return (
      <li key={item.key}>
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
          className={clsx(
            'flex items-center gap-3 rounded-md px-3 py-2.5 text-small font-medium transition-colors duration-fast',
            active
              ? 'bg-brand text-brand-ink'
              : 'text-ink-muted hover:bg-surface-raised hover:text-ink'
          )}
        >
          <IconByName name={item.icon} className="size-4.5 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{t(`nav.${item.key}`)}</span>
          {item.key === 'tickets' && (dashboard?.tickets.new ?? 0) > 0 && (
            <span
              className={clsx(
                'ms-auto rounded-pill px-1.5 text-[10px] font-semibold',
                active ? 'bg-brand-ink/20 text-brand-ink' : 'bg-brand text-brand-ink'
              )}
            >
              {dashboard?.tickets.new}
            </span>
          )}
          {item.developerOnly && (
            <IconByName
              name="cog"
              className="ms-auto size-3.5 opacity-60"
              aria-label={t('nav.developerTools')}
            />
          )}
        </Link>
      </li>
    );
  };

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/admin" className="flex items-center gap-2 px-2 py-1" onClick={onNavigate}>
        <span className="grid size-8 place-items-center rounded-md bg-brand text-brand-ink text-small font-bold">
          {(me?.displayName || me?.email || 'A').charAt(0).toUpperCase()}
        </span>
        <span className="text-body font-semibold">{t('brand')}</span>
      </Link>
      <nav aria-label={t('nav.dashboard')} className="flex flex-1 flex-col gap-6">
        <ul className="flex flex-col gap-1" role="list">
          {ADMIN_NAV.map(renderItem)}
        </ul>
        <ul className="mt-auto flex flex-col gap-1 border-t border-line pt-4" role="list">
          {ADMIN_NAV_FOOTER.map(renderItem)}
          <li>
            <Link
              href="/"
              target="_blank"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-small font-medium text-ink-muted hover:bg-surface-raised hover:text-ink"
            >
              <IconByName name="external-link" className="size-4.5" strokeWidth={1.75} />
              {t('nav.viewSite')}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
