'use client';

import { currentPage, hasNextPage, hasPreviousPage } from '@/lib/pagination';
import clsx from 'clsx';
import React from 'react';
import Button from '../Button';

export interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  dataLength: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const Pagination: React.FC<PaginationProps> = ({
  total,
  limit,
  offset,
  total_pages,
  dataLength,
  onPageChange,
  onLimitChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  isLoading = false,
}) => {
  if (total === 0) return null;

  const page = currentPage(offset, limit);
  const canGoPrevious = hasPreviousPage(offset);
  const canGoNext = hasNextPage(offset, dataLength, total);

  return (
    <div className="flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-sm">
        <label htmlFor="page-size" className="text-sm">
          Rows per page
        </label>
        <select
          id="page-size"
          className={clsx('select select-bordered select-sm')}
          value={limit}
          disabled={isLoading}
          onChange={(event) => onLimitChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-sm">
        <span className="text-sm">
          Page {page} of {total_pages}
        </span>
        <Button
          variant="secondary"
          disabled={!canGoPrevious || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={!canGoNext || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
