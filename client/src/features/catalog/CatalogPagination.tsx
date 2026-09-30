'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import IconByName from '@/shared/UI/IconByName';

interface CatalogPaginationProps {
  total: number;
  limit: number;
  offset: number;
}

/** URL-based pagination (`?offset=`) so every page is a crawlable, cacheable URL. */
const CatalogPagination = ({ total, limit, offset }: CatalogPaginationProps) => {
  const t = useTranslations('catalog');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  const current = Math.floor(offset / limit);
  const href = (page: number) => {
    const p = new URLSearchParams(searchParams.toString());
    if (page === 0) p.delete('offset');
    else p.set('offset', String(page * limit));
    return `${pathname}${p.size ? `?${p}` : ''}`;
  };
  return (
    <nav aria-label={t('pagination')} className="flex items-center justify-center gap-1">
      <Link
        href={href(Math.max(0, current - 1))}
        aria-disabled={current === 0}
        className="btn btn-sm btn-ghost"
        scroll
      >
        <IconByName name="chevron-left" className="size-4 rtl:-scale-x-100" />
      </Link>
      {Array.from({ length: pages }, (_, i) => (
        <Link
          key={i}
          href={href(i)}
          aria-current={i === current ? 'page' : undefined}
          className={i === current ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost'}
          scroll
        >
          {new Intl.NumberFormat().format(i + 1)}
        </Link>
      ))}
      <Link
        href={href(Math.min(pages - 1, current + 1))}
        aria-disabled={current >= pages - 1}
        className="btn btn-sm btn-ghost"
        scroll
      >
        <IconByName name="chevron-right" className="size-4 rtl:-scale-x-100" />
      </Link>
    </nav>
  );
};

export default CatalogPagination;
