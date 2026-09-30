import api from '@/lib/axiosInstance';
import { buildPaginationQueryParams, DEFAULT_OFFSET } from '@/lib/pagination';
import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';
import {
  adminDashboardReadResponse2DashboardSchema,
  adminTicketsPaginatedListReadResponse2TicketPaginatedListSchema,
  adminTicketsReadResponse2TicketSchema,
  publicTicketsTokenReadResponse2TicketTokenSchema,
} from './adapter.apiToLocal';
import type { AdminTicketsPaginatedListReadQueryPayload } from './interface.payload';
import type {
  DashboardSchema,
  TicketPaginatedListSchema,
  TicketSchema,
  TicketTokenSchema,
} from './interface.schema';
import {
  ADMIN_DASHBOARD_ROUTE,
  ADMIN_TICKETS_ROUTE,
  getAdminTicketsRouteById,
  PUBLIC_TICKETS_TOKEN_ROUTE,
} from './route.api';

interface QueryHookOptions {
  enabled?: boolean;
}

export const ADMIN_TICKETS_LIST_QUERY_KEY = 'get-admin-tickets-paginated-list';
export const ADMIN_DASHBOARD_QUERY_KEY = ['get-admin-dashboard'] as const;

/** One token per mounted form; never cached across forms or shared between users. */
const useGetPublicTicketsToken = ({ options }: { options?: QueryHookOptions } = {}) => {
  const formId = useId();
  return useQuery({
    queryKey: ['get-public-tickets-token', formId],
    queryFn: api.get<TicketTokenSchema>(
      PUBLIC_TICKETS_TOKEN_ROUTE,
      publicTicketsTokenReadResponse2TicketTokenSchema
    ),
    enabled: options?.enabled ?? true,
    staleTime: Infinity,
    gcTime: 0,
    retry: 1,
  });
};

const useGetAdminTicketsPaginatedList = ({
  query,
  options,
}: { query?: AdminTicketsPaginatedListReadQueryPayload; options?: QueryHookOptions } = {}) => {
  const queryParams = buildPaginationQueryParams({
    limit: query?.limit ?? 20,
    offset: query?.offset ?? DEFAULT_OFFSET,
    status: query?.status,
    page: query?.page,
    q: query?.q,
  });
  return useQuery({
    queryKey: [ADMIN_TICKETS_LIST_QUERY_KEY, queryParams],
    queryFn: api.get<TicketPaginatedListSchema>(
      ADMIN_TICKETS_ROUTE,
      adminTicketsPaginatedListReadResponse2TicketPaginatedListSchema,
      queryParams
    ),
    enabled: options?.enabled ?? true,
  });
};

const useGetAdminTicketsById = ({ id, options }: { id: string; options?: QueryHookOptions }) =>
  useQuery({
    queryKey: ['get-admin-tickets-by-id', id],
    queryFn: api.get<TicketSchema>(
      getAdminTicketsRouteById(id),
      adminTicketsReadResponse2TicketSchema
    ),
    enabled: options?.enabled ?? true,
  });

const useGetAdminDashboard = ({ options }: { options?: QueryHookOptions } = {}) =>
  useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: api.get<DashboardSchema>(
      ADMIN_DASHBOARD_ROUTE,
      adminDashboardReadResponse2DashboardSchema
    ),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

export {
  useGetAdminDashboard,
  useGetAdminTicketsById,
  useGetAdminTicketsPaginatedList,
  useGetPublicTicketsToken,
};
