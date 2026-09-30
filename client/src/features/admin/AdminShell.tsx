'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ADMIN_LOGIN_PATH, useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import { LocalesProvider } from './LocalesContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/** Authenticated frame for every /admin screen: redirects to login, then renders sidebar + topbar. */
const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('admin');
  const { isAuthenticated, initializing } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!initializing && !isAuthenticated) router.replace(ADMIN_LOGIN_PATH);
  }, [initializing, isAuthenticated, router]);

  if (initializing || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <LocalesProvider>
      <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden border-e border-line bg-canvas-subtle lg:sticky lg:top-0 lg:block lg:h-dvh">
          <Sidebar />
        </aside>

        {/* Mobile sidebar */}
        <div
          className={clsx(
            'fixed inset-0 z-40 lg:hidden',
            sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
          )}
          aria-hidden={!sidebarOpen}
        >
          <div
            className={clsx(
              'absolute inset-0 bg-gray-950/50 transition-opacity duration-base',
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={clsx(
              'absolute inset-y-0 start-0 w-72 max-w-[85vw] bg-canvas shadow-lg transition-transform duration-base ease-out-expo',
              sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
            )}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label={t('nav.closeSidebar')}
              className="btn btn-ghost btn-square btn-sm absolute end-2 top-3"
            >
              <IconByName name="x" className="size-5" />
            </button>
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>

        <div className="flex min-h-dvh flex-col">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex flex-1 flex-col gap-6 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </LocalesProvider>
  );
};

export default AdminShell;
