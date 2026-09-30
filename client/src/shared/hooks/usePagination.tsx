'use client';

import {
  clampLimit,
  clampOffset,
  currentPage,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  offsetForPage,
} from '@/lib/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

const parseLimit = (value: string | null): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return clampLimit(parsed);
};

const parseOffset = (value: string | null): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return DEFAULT_OFFSET;
  return parsed;
};

const usePagination = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const limit = useMemo(() => parseLimit(searchParams.get('limit')), [searchParams]);
  const offset = useMemo(() => parseOffset(searchParams.get('offset')), [searchParams]);
  const page = useMemo(() => currentPage(offset, limit), [offset, limit]);

  const updateParams = useCallback(
    (nextLimit: number, nextOffset: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', String(clampLimit(nextLimit)));
      params.set('offset', String(Math.max(nextOffset, DEFAULT_OFFSET)));
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const setPage = useCallback(
    (pageNumber: number) => {
      updateParams(limit, offsetForPage(pageNumber, limit));
    },
    [limit, updateParams]
  );

  const setLimit = useCallback(
    (nextLimit: number) => {
      updateParams(nextLimit, DEFAULT_OFFSET);
    },
    [updateParams]
  );

  const resetOffset = useCallback(() => {
    updateParams(limit, DEFAULT_OFFSET);
  }, [limit, updateParams]);

  const clampToTotal = useCallback(
    (total: number) => {
      const clampedOffset = clampOffset(offset, total, limit);
      if (clampedOffset !== offset) {
        updateParams(limit, clampedOffset);
      }
    },
    [limit, offset, updateParams]
  );

  return {
    limit,
    offset,
    currentPage: page,
    setPage,
    setLimit,
    resetOffset,
    clampToTotal,
  };
};

export default usePagination;
