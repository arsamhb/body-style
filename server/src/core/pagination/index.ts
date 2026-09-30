/**
 * Offset-based pagination, matching the frontend contract in src/lib/pagination/index.ts.
 * Response envelope: { data, total, limit, offset, total_pages } (total_pages stays snake_case
 * to match the existing frontend types).
 */

export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 100;
export const DEFAULT_OFFSET = 0;

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
}

export const clampLimit = (limit: number): number =>
  Math.min(Math.max(limit, 1), MAX_LIMIT);
export const clampOffset = (offset: number): number =>
  Math.max(offset, DEFAULT_OFFSET);

const toInt = (value: unknown, fallback: number): number => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
};

/** True when the client actually asked for pagination (so plain-list callers still get an array). */
export const hasPaginationParams = (query: Record<string, unknown>): boolean =>
  query.limit !== undefined || query.offset !== undefined;

export const parsePagination = (
  query: Record<string, unknown>,
): PaginationParams => ({
  limit: clampLimit(toInt(query.limit, DEFAULT_LIMIT)),
  offset: clampOffset(toInt(query.offset, DEFAULT_OFFSET)),
});

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  { limit, offset }: PaginationParams,
): PaginatedResponse<T> => ({
  data,
  total,
  limit,
  offset,
  total_pages: limit > 0 ? Math.ceil(total / limit) : 0,
});
