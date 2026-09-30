'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  useDeleteAdminCatalogItemsById,
  usePatchAdminCatalogItemsStatusById,
} from '@/app/_service/catalog/hook.mutation';
import {
  ADMIN_CATALOG_ITEMS_LIST_QUERY_KEY,
  useGetAdminCatalogItemsPaginatedList,
} from '@/app/_service/catalog/hook.query';
import type { CatalogItemSchema } from '@/app/_service/catalog/interface.schema';
import type { ItemStatus } from '@/features/catalog/types';
import { notify } from '@/lib/notification/notificationService';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import Can from '../Can';
import RequirePermission from '../RequirePermission';
import { useLocales } from '../LocalesContext';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import StatusBadge from '../ui/StatusBadge';
import { useTypeOptions } from './useTypeOptions';

const ItemsScreen = () => {
  const t = useTranslations('admin');
  const { defaultLocale } = useLocales();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { options: typeOptions, label: typeLabel, types } = useTypeOptions();
  const [typeId, setTypeId] = useState(searchParams.get('typeId') ?? '');
  const [status, setStatus] = useState<ItemStatus | ''>('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const limit = 20;
  const { data, isLoading } = useGetAdminCatalogItemsPaginatedList({
    query: {
      limit,
      offset: page * limit,
      typeId: typeId || undefined,
      status: status || undefined,
      q: q || undefined,
    },
  });
  const [toDelete, setToDelete] = useState<CatalogItemSchema | null>(null);
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [ADMIN_CATALOG_ITEMS_LIST_QUERY_KEY] });
  const setStatusMut = usePatchAdminCatalogItemsStatusById(() => invalidate());
  const remove = useDeleteAdminCatalogItemsById(() => {
    notify.success(t('common.deleted'));
    invalidate();
    setToDelete(null);
  });

  return (
    <RequirePermission anyOf={['catalog.items', 'catalog.categories']}>
      <PageHeader
        title={t('catalog.items.title')}
        subtitle={t('catalog.items.subtitle')}
        actions={
          <Can permission="catalog.items">
            <Link
              href={`/admin/catalog/items/new${typeId ? `?typeId=${typeId}` : ''}`}
              className="btn btn-primary btn-sm"
            >
              <IconByName name="plus" className="size-4" />
              {t('catalog.items.new')}
            </Link>
          </Can>
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="select select-sm"
          value={typeId}
          onChange={(e) => (setTypeId(e.target.value), setPage(0))}
          aria-label={t('catalog.items.type')}
        >
          <option value="">{t('catalog.items.allTypes')}</option>
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className="select select-sm"
          value={status}
          onChange={(e) => (setStatus(e.target.value as ItemStatus | ''), setPage(0))}
          aria-label={t('catalog.items.status')}
        >
          <option value="">{t('catalog.items.allStatuses')}</option>
          <option value="published">{t('catalog.items.published')}</option>
          <option value="draft">{t('catalog.items.draft')}</option>
        </select>
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            setQ((new FormData(e.currentTarget).get('q') as string) ?? '');
            setPage(0);
          }}
        >
          <IconByName
            name="search"
            className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
          />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder={t('common.search')}
            className="input input-sm ps-9"
          />
        </form>
      </div>
      {isLoading ? (
        <Loading size="md" />
      ) : !data?.data.length ? (
        <EmptyState icon="package" title={t('catalog.items.empty')} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="table">
            <thead>
              <tr>
                <th>{t('catalog.items.item')}</th>
                <th>{t('catalog.items.type')}</th>
                <th>{t('catalog.items.status')}</th>
                <th>{t('catalog.items.featured')}</th>
                <th className="text-end">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item) => {
                const type = types.find((x) => x.id === item.typeId);
                return (
                  <tr key={item.id} className="hover:bg-surface-raised/60">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface-raised">
                          {(item.coverImage || item.images[0]) && (
                            <Image
                              src={item.coverImage || item.images[0]}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {item.title[defaultLocale] || item.slug}
                          </p>
                          <code className="text-caption text-ink-subtle" dir="ltr">
                            {item.slug}
                          </code>
                        </div>
                      </div>
                    </td>
                    <td className="text-small text-ink-muted">{type ? typeLabel(type) : '—'}</td>
                    <td>
                      <Can
                        permission="catalog.items"
                        fallback={
                          <StatusBadge tone={item.status === 'published' ? 'success' : 'neutral'}>
                            {t(`catalog.items.${item.status}`)}
                          </StatusBadge>
                        }
                      >
                        <button
                          type="button"
                          className="btn btn-xs btn-ghost gap-1 px-1"
                          disabled={setStatusMut.isPending}
                          onClick={() =>
                            setStatusMut.mutate({
                              id: item.id,
                              payload: {
                                status: item.status === 'published' ? 'draft' : 'published',
                              },
                            })
                          }
                          title={t('catalog.items.toggleStatus')}
                        >
                          <StatusBadge tone={item.status === 'published' ? 'success' : 'neutral'}>
                            {t(`catalog.items.${item.status}`)}
                          </StatusBadge>
                        </button>
                      </Can>
                    </td>
                    <td>
                      {item.featured && <IconByName name="star" className="size-4 text-warning" />}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {type && item.status === 'published' && (
                          <a
                            href={`/catalog/${type.slug}/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm btn-square"
                            aria-label={t('nav.viewSite')}
                          >
                            <IconByName name="external-link" className="size-4" />
                          </a>
                        )}
                        <Can permission="catalog.items">
                          <Link
                            href={`/admin/catalog/items/${item.id}`}
                            className="btn btn-ghost btn-sm btn-square"
                            aria-label={t('common.edit')}
                          >
                            <IconByName name="pencil" className="size-4" />
                          </Link>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-square text-danger"
                            aria-label={t('common.delete')}
                            onClick={() => setToDelete(item)}
                          >
                            <IconByName name="trash-2" className="size-4" />
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {data.total_pages > 1 && (
            <div className="flex items-center justify-between border-t border-line px-4 py-3 text-small text-ink-muted">
              <span>{t('catalog.items.count', { count: data.total })}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <IconByName name="chevron-left" className="size-4 rtl:-scale-x-100" />
                </button>
                <span className="self-center">
                  {page + 1} / {data.total_pages}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  disabled={page + 1 >= data.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <IconByName name="chevron-right" className="size-4 rtl:-scale-x-100" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('catalog.items.deleteTitle')}
        text={t('catalog.items.deleteText')}
        confirmLabel={t('common.delete')}
        danger
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate({ id: toDelete.id })}
      />
    </RequirePermission>
  );
};

export default ItemsScreen;
