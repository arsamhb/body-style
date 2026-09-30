'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { SUPPORTED_LOCALES } from '@/i18n/routing';
import IconByName from '@/shared/UI/IconByName';
import LocaleSwitcher from '@/shared/layout/public/LocaleSwitcher';
import ThemeToggle from '@/shared/layout/public/ThemeToggle';

interface TopbarProps {
  onOpenSidebar: () => void;
}

const Topbar = ({ onOpenSidebar }: TopbarProps) => {
  const t = useTranslations('admin');
  const { me, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur-md lg:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label={t('nav.openSidebar')}
        className="btn btn-ghost btn-square btn-sm lg:hidden"
      >
        <IconByName name="menu" className="size-5" />
      </button>
      <div className="ms-auto flex items-center gap-2">
        <LocaleSwitcher locales={[...SUPPORTED_LOCALES]} />
        <ThemeToggle />
        <div className="dropdown dropdown-end">
          <button type="button" tabIndex={0} className="btn btn-ghost btn-sm gap-2 normal-case">
            <span className="grid size-7 place-items-center rounded-full bg-surface-raised text-caption font-semibold">
              {(me?.displayName || me?.email || '?').charAt(0).toUpperCase()}
            </span>
            <span className="hidden max-w-40 truncate text-small sm:inline">
              {me?.displayName || me?.email}
            </span>
            {me && <span className="badge badge-sm badge-outline">{t(`roles.${me.role}`)}</span>}
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu z-40 mt-2 w-56 rounded-box border border-line bg-surface p-2 shadow-lg"
          >
            <li className="menu-title truncate text-caption">{me?.email}</li>
            <li>
              <button type="button" onClick={logout} className="text-danger">
                <IconByName name="log-out" className="size-4" />
                {t('nav.logout')}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
