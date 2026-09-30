export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 100;
export const DEFAULT_OFFSET = 0;
export const FIRST_PAGE_INDEX = 1;

export type PaginationQuery = {
  limit?: number;
  offset?: number;
};

export interface PaginatedMeta {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
}

export const currentPage = (offset: number, limit: number): number =>
  Math.floor(offset / limit) + FIRST_PAGE_INDEX;

export const offsetForPage = (page: number, limit: number): number => (page - 1) * limit;

export const hasPreviousPage = (offset: number): boolean => offset > 0;

export const hasNextPage = (offset: number, dataLength: number, total: number): boolean =>
  offset + dataLength < total;

export const clampOffset = (offset: number, total: number, limit: number): number => {
  if (total === 0) return DEFAULT_OFFSET;
  const totalPages = Math.ceil(total / limit);
  const maxOffset = (totalPages - 1) * limit;
  return Math.min(Math.max(offset, DEFAULT_OFFSET), maxOffset);
};

export const clampLimit = (limit: number): number => Math.min(Math.max(limit, 1), MAX_LIMIT);

export const buildPaginationQueryParams = ({
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  ...filters
}: PaginationQuery & Record<string, unknown>): Record<string, string | number> => {
  const params: Record<string, string | number> = {
    limit: clampLimit(limit),
    offset: Math.max(offset, DEFAULT_OFFSET),
  };

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      params[key] = String(value);
    }
  }

  return params;
};
