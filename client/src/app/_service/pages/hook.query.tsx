import api from '@/lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import {
  adminPagesListReadResponse2PageSummaryListSchema,
  adminPagesReadResponse2PageSchema,
} from './adapter.apiToLocal';
import type { PageSchema, PageSummaryListSchema } from './interface.schema';
import { ADMIN_PAGES_ROUTE, getAdminPagesRouteByKey } from './route.api';

interface QueryHookOptions {
  enabled?: boolean;
}

export const ADMIN_PAGES_LIST_QUERY_KEY = ['get-admin-pages-list'] as const;
export const adminPagesByKeyQueryKey = (key: string) => ['get-admin-pages-by-key', key] as const;

const useGetAdminPagesList = ({ options }: { options?: QueryHookOptions } = {}) =>
  useQuery({
    queryKey: ADMIN_PAGES_LIST_QUERY_KEY,
    queryFn: api.get<PageSummaryListSchema>(
      ADMIN_PAGES_ROUTE,
      adminPagesListReadResponse2PageSummaryListSchema
    ),
    enabled: options?.enabled ?? true,
  });

const useGetAdminPagesByKey = ({ key, options }: { key: string; options?: QueryHookOptions }) =>
  useQuery({
    queryKey: adminPagesByKeyQueryKey(key),
    queryFn: api.get<PageSchema>(getAdminPagesRouteByKey(key), adminPagesReadResponse2PageSchema),
    enabled: options?.enabled ?? true,
  });

export { useGetAdminPagesByKey, useGetAdminPagesList };
