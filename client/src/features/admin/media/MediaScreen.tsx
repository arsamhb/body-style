'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { useDeleteAdminMediaById } from '@/app/_service/media/hook.mutation';
import {
  ADMIN_MEDIA_LIST_QUERY_KEY,
  useGetAdminMediaPaginatedList,
} from '@/app/_service/media/hook.query';
import type { MediaSchema } from '@/app/_service/media/interface.schema';
import { notify } from '@/lib/notification/notificationService';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import Can from '../Can';
import { UploadButton } from '../fields/MediaPickerModal';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';

const formatBytes = (n: number) =>
  n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;

const MediaScreen = () => {
  const t = useTranslations('admin');
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const limit = 40;
  const { data, isLoading } = useGetAdminMediaPaginatedList({
    query: { limit, offset: page * limit },
  });
  const [toDelete, setToDelete] = useState<MediaSchema | null>(null);
  const remove = useDeleteAdminMediaById(() => {
    notify.success(t('common.deleted'));
    queryClient.invalidateQueries({ queryKey: [ADMIN_MEDIA_LIST_QUERY_KEY] });
    setToDelete(null);
  });

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      notify.success(t('media.copied'));
    } catch {}
  };

  return (
    <>
      <PageHeader
        title={t('media.title')}
        subtitle={t('media.subtitle')}
        actions={
          <UploadButton onUploaded={() => notify.success(t('media.uploaded'))} className="btn-md" />
        }
      />
      {isLoading ? (
        <Loading size="md" />
      ) : !data?.data.length ? (
        <EmptyState icon="image" title={t('media.empty')} text={t('media.dropHint')} />
      ) : (
        <>
          <ul
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
            role="list"
          >
            {data.data.map((m) => (
              <li
                key={m.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface"
              >
                <div className="relative aspect-square bg-surface-raised">
                  <Image
                    src={m.thumbUrl}
                    alt={m.alt.fa ?? m.alt.en ?? ''}
                    fill
                    sizes="240px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <span className="truncate text-caption font-medium" title={m.originalName}>
                    {m.originalName || m.url.split('/').pop()}
                  </span>
                  <span className="text-caption text-ink-subtle" dir="ltr">
                    {t('media.dimensions', { w: m.width, h: m.height })} · {formatBytes(m.size)}
                  </span>
                  <div className="mt-1 flex gap-1">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => copy(m.url)}
                    >
                      <IconByName name="copy" className="size-3.5" />
                      {t('media.copyUrl')}
                    </button>
                    <Can permission="media">
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-square ms-auto text-danger"
                        aria-label={t('common.delete')}
                        onClick={() => setToDelete(m)}
                      >
                        <IconByName name="trash-2" className="size-3.5" />
                      </button>
                    </Can>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {data.total_pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className="btn btn-sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <IconByName name="chevron-left" className="size-4 rtl:-scale-x-100" />
              </button>
              <span className="self-center text-small text-ink-muted">
                {page + 1} / {data.total_pages}
              </span>
              <button
                type="button"
                className="btn btn-sm"
                disabled={page + 1 >= data.total_pages}
                onClick={() => setPage((p) => p + 1)}
              >
                <IconByName name="chevron-right" className="size-4 rtl:-scale-x-100" />
              </button>
            </div>
          )}
        </>
      )}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('media.deleteTitle')}
        text={t('media.deleteText')}
        confirmLabel={t('common.delete')}
        danger
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate({ id: toDelete.id })}
      />
    </>
  );
};

export default MediaScreen;
