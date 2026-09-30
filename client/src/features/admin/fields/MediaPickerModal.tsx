'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { usePostAdminMedia } from '@/app/_service/media/hook.mutation';
import {
  ADMIN_MEDIA_LIST_QUERY_KEY,
  useGetAdminMediaPaginatedList,
} from '@/app/_service/media/hook.query';
import type { MediaSchema } from '@/app/_service/media/interface.schema';
import Can from '../Can';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import Drawer from '../ui/Drawer';
import EmptyState from '../ui/EmptyState';

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaSchema) => void;
}

export const UploadButton = ({
  onUploaded,
  className,
}: {
  onUploaded?: (m: MediaSchema) => void;
  className?: string;
}) => {
  const t = useTranslations('admin.fields');
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = usePostAdminMedia((media) => {
    queryClient.invalidateQueries({ queryKey: [ADMIN_MEDIA_LIST_QUERY_KEY] });
    onUploaded?.(media);
  });
  return (
    <Can permission="media">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload.mutate({ file });
          e.target.value = '';
        }}
      />
      <button
        type="button"
        className={clsx('btn btn-primary btn-sm', className)}
        disabled={upload.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {upload.isPending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <IconByName name="upload" className="size-4" />
        )}
        {upload.isPending ? t('uploading') : t('upload')}
      </button>
    </Can>
  );
};

/** Grid of the image library with upload; selecting an image calls `onSelect` and closes. */
const MediaPickerModal = ({ open, onClose, onSelect }: MediaPickerModalProps) => {
  const t = useTranslations('admin');
  const [page, setPage] = useState(0);
  const limit = 40;
  const { data, isLoading } = useGetAdminMediaPaginatedList({
    query: { limit, offset: page * limit },
    options: { enabled: open },
  });

  return (
    <Drawer open={open} onClose={onClose} title={t('fields.library')} size="lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-caption text-ink-subtle">{t('media.dropHint')}</span>
        <UploadButton onUploaded={(m) => onSelect(m)} />
      </div>
      {isLoading ? (
        <Loading size="md" />
      ) : !data?.data.length ? (
        <EmptyState icon="image" title={t('media.empty')} />
      ) : (
        <>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5" role="list">
            {data.data.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => onSelect(m)}
                  className="group relative block aspect-square w-full overflow-hidden rounded-md border border-line bg-surface-raised focus-visible:shadow-glow"
                  title={m.originalName}
                >
                  <Image
                    src={m.thumbUrl}
                    alt={m.alt.fa ?? m.alt.en ?? ''}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                </button>
              </li>
            ))}
          </ul>
          {data.total_pages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                className="btn btn-sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <IconByName name="chevron-left" className="size-4 rtl:-scale-x-100" />
              </button>
              <span className="text-small text-ink-muted self-center">
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
    </Drawer>
  );
};

export default MediaPickerModal;
