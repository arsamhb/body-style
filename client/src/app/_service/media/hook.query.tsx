import api from '@/lib/axiosInstance';
import { buildPaginationQueryParams, DEFAULT_OFFSET } from '@/lib/pagination';
import { useQuery } from '@tanstack/react-query';
import { adminMediaPaginatedListReadResponse2MediaPaginatedListSchema } from './adapter.apiToLocal';
import type { AdminMediaPaginatedListReadQueryPayload } from './interface.payload';
import type { MediaPaginatedListSchema } from './interface.schema';
import { ADMIN_MEDIA_ROUTE } from './route.api';

interface QueryHookOptions {
  enabled?: boolean;
}

export const ADMIN_MEDIA_LIST_QUERY_KEY = 'get-admin-media-paginated-list';

const useGetAdminMediaPaginatedList = ({
  query,
  options,
}: { query?: AdminMediaPaginatedListReadQueryPayload; options?: QueryHookOptions } = {}) => {
  const queryParams = buildPaginationQueryParams({
    limit: query?.limit ?? 40,
    offset: query?.offset ?? DEFAULT_OFFSET,
  });
  return useQuery({
    queryKey: [ADMIN_MEDIA_LIST_QUERY_KEY, queryParams],
    queryFn: api.get<MediaPaginatedListSchema>(
      ADMIN_MEDIA_ROUTE,
      adminMediaPaginatedListReadResponse2MediaPaginatedListSchema,
      queryParams
    ),
    enabled: options?.enabled ?? true,
  });
};

export { useGetAdminMediaPaginatedList };
