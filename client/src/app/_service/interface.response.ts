/** Shared wire envelope for paginated list endpoints (`?limit=&offset=`). */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
}
