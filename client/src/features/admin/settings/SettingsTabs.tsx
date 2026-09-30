'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { PermissionKey } from '@/lib/auth/permissions';
import { useCan } from '../Can';
import PageHeader from '../ui/PageHeader';

export const SETTINGS_TABS: {
  key: string;
  href: string;
  permission?: PermissionKey;
  developerOnly?: boolean;
}[] = [
  { key: 'branding', href: '/admin/settings/branding', permission: 'settings.branding' },
  { key: 'navigation', href: '/admin/settings/navigation', permission: 'settings.navigation' },
  { key: 'contact', href: '/admin/settings/contact', permission: 'settings.contact' },
  { key: 'seo', href: '/admin/settings/seo', permission: 'settings.seo' },
  { key: 'locales', href: '/admin/settings/locales', developerOnly: true },
];

const SettingsTabs = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('admin.settings');
  const pathname = usePathname();
  const can = useCan();
  const tabs = SETTINGS_TABS.filter((tab) => can(tab));
  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-line">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              role="tab"
              aria-selected={active}
              className={clsx(
                '-mb-px border-b-2 px-4 py-2.5 text-small font-medium transition-colors',
                active
                  ? 'border-brand text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink'
              )}
            >
              {t(`tabs.${tab.key}`)}
            </Link>
          );
        })}
      </div>
      <div className="max-w-4xl">{children}</div>
    </>
  );
};

export default SettingsTabs;
