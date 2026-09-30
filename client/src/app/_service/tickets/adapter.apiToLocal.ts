import type {
  AdminDashboardReadResponse,
  AdminTicketsPaginatedListReadResponse,
  AdminTicketsReadResponse,
  PublicTicketsTokenReadResponse,
} from './interface.response';
import type {
  DashboardSchema,
  TicketPaginatedListSchema,
  TicketSchema,
  TicketTokenSchema,
} from './interface.schema';

export const publicTicketsTokenReadResponse2TicketTokenSchema = (
  api: PublicTicketsTokenReadResponse
): TicketTokenSchema => ({
  token: api.token,
  minDelayMs: api.minDelayMs,
  issuedAt: Date.now(),
});

export const adminTicketsReadResponse2TicketSchema = (
  api: AdminTicketsReadResponse
): TicketSchema => ({
  id: api.id,
  name: api.name,
  phone: api.phone,
  message: api.message ?? '',
  locale: api.locale,
  status: api.status,
  adminNote: api.adminNote ?? '',
  source: {
    page: api.source.page,
    section: api.source.section ?? '',
    itemId: api.source.itemId ?? '',
    itemSlug: api.source.itemSlug ?? '',
    itemTitle: api.source.itemTitle ?? '',
    path: api.source.path ?? '',
  },
  userAgent: api.userAgent ?? '',
  createdAt: new Date(api.createdAt),
  updatedAt: new Date(api.updatedAt),
});

export const adminTicketsPaginatedListReadResponse2TicketPaginatedListSchema = (
  api: AdminTicketsPaginatedListReadResponse
): TicketPaginatedListSchema => ({
  data: api.data.map(adminTicketsReadResponse2TicketSchema),
  total: api.total,
  limit: api.limit,
  offset: api.offset,
  total_pages: api.total_pages,
});

export const adminDashboardReadResponse2DashboardSchema = (
  api: AdminDashboardReadResponse
): DashboardSchema => api;
