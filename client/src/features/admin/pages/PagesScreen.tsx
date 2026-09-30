'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePatchAdminPagesEnabledByKey } from '@/app/_service/pages/hook.mutation';
import { ADMIN_PAGES_LIST_QUERY_KEY, useGetAdminPagesList } from '@/app/_service/pages/hook.query';
import type { PermissionKey } from '@/lib/auth/permissions';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import Can, { useCan } from '../Can';
import PageHeader from '../ui/PageHeader';
import StatusBadge from '../ui/StatusBadge';

const PAGE_ICON: Record<string, string> = {
  landing: 'house',
  about: 'users',
  contact: 'phone',
  catalog: 'package',
};

const PagesScreen = () => {
  const t = useTranslations('admin');
  const can = useCan();
  const queryClient = useQueryClient();
  const { data: pages, isLoading } = useGetAdminPagesList();
  const toggle = usePatchAdminPagesEnabledByKey(() =>
    queryClient.invalidateQueries({ queryKey: ADMIN_PAGES_LIST_QUERY_KEY })
  );

  return (
    <>
      <PageHeader title={t('pages.title')} subtitle={t('pages.subtitle')} />
      {isLoading ? (
        <Loading size="md" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="list">
          {pages?.map((page) => {
            const editable = can({ permission: `pages.${page.key}` as PermissionKey });
            return (
              <li
                key={page.key}
                className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="icon-tile">
                    <IconByName name={PAGE_ICON[page.key] ?? 'file-text'} className="size-5" />
                  </span>
                  <StatusBadge tone={page.enabled ? 'success' : 'neutral'}>
                    {page.enabled ? t('common.active') : t('common.inactive')}
                  </StatusBadge>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-h4">{t(`pages.keys.${page.key}`)}</h2>
                  <p className="text-caption text-ink-muted">
                    {t('pages.sectionCount', {
                      enabled: page.enabledSectionCount,
                      total: page.sectionCount,
                    })}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  {editable ? (
                    <Link href={`/admin/pages/${page.key}`} className="btn btn-sm btn-primary">
                      <IconByName name="pencil" className="size-4" />
                      {t('common.edit')}
                    </Link>
                  ) : (
                    <span className="text-caption text-ink-subtle">{t('pages.noAccess')}</span>
                  )}
                  <Can developerOnly>
                    <label className="flex items-center gap-2 text-caption text-ink-muted">
                      {t('pages.enabled')}
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={page.enabled}
                        disabled={toggle.isPending}
                        onChange={(e) =>
                          toggle.mutate({ key: page.key, payload: { enabled: e.target.checked } })
                        }
                      />
                    </label>
                  </Can>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default PagesScreen;
