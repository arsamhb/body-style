'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useDeleteAdminCatalogTypesById } from '@/app/_service/catalog/hook.mutation';
import {
  ADMIN_CATALOG_TYPES_LIST_QUERY_KEY,
  useGetAdminCatalogTypesList,
} from '@/app/_service/catalog/hook.query';
import type { CatalogTypeSchema } from '@/app/_service/catalog/interface.schema';
import { notify } from '@/lib/notification/notificationService';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import RequirePermission from '../RequirePermission';
import { useLocales } from '../LocalesContext';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import StatusBadge from '../ui/StatusBadge';

const TypesScreen = () => {
  const t = useTranslations('admin');
  const { defaultLocale } = useLocales();
  const queryClient = useQueryClient();
  const { data: types, isLoading } = useGetAdminCatalogTypesList();
  const [toDelete, setToDelete] = useState<CatalogTypeSchema | null>(null);
  const remove = useDeleteAdminCatalogTypesById(() => {
    notify.success(t('common.deleted'));
    queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_TYPES_LIST_QUERY_KEY });
    setToDelete(null);
  });

  return (
    <RequirePermission developerOnly>
      <PageHeader
        title={t('catalog.types.title')}
        subtitle={t('catalog.types.subtitle')}
        actions={
          <Link href="/admin/catalog/types/new" className="btn btn-primary">
            <IconByName name="plus" className="size-4" />
            {t('catalog.types.new')}
          </Link>
        }
      />
      {isLoading ? (
        <Loading size="md" />
      ) : !types?.length ? (
        <EmptyState
          icon="layers"
          title={t('catalog.types.empty')}
          text={t('catalog.types.emptyText')}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="list">
          {types.map((type) => (
            <li
              key={type.id}
              className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="icon-tile">
                  <IconByName name="layers" className="size-5" />
                </span>
                <StatusBadge tone={type.enabled ? 'success' : 'neutral'}>
                  {type.enabled ? t('common.active') : t('common.inactive')}
                </StatusBadge>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-h4">{type.name[defaultLocale] || type.slug}</h2>
                <code className="text-caption text-ink-subtle" dir="ltr">
                  /catalog/{type.slug}
                </code>
                <p className="text-caption text-ink-muted">
                  {t('catalog.types.summary', {
                    specs: type.specDefinitions.length,
                    items: type.itemCount,
                  })}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2">
                <Link href={`/admin/catalog/types/${type.id}`} className="btn btn-sm btn-primary">
                  <IconByName name="pencil" className="size-4" />
                  {t('common.edit')}
                </Link>
                <Link
                  href={`/admin/catalog/items?typeId=${type.id}`}
                  className="btn btn-sm btn-ghost"
                >
                  {t('catalog.types.viewItems')}
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-square ms-auto text-danger"
                  aria-label={t('common.delete')}
                  disabled={type.itemCount > 0}
                  title={type.itemCount > 0 ? t('catalog.types.deleteBlocked') : undefined}
                  onClick={() => setToDelete(type)}
                >
                  <IconByName name="trash-2" className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('catalog.types.deleteTitle')}
        text={t('catalog.types.deleteText')}
        confirmLabel={t('common.delete')}
        danger
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate({ id: toDelete.id })}
      />
    </RequirePermission>
  );
};

export default TypesScreen;
