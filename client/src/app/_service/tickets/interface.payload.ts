import type { PaginationQuery } from '@/lib/pagination';
import type { TicketSourcePage, TicketStatus } from './interface.response';

export interface PublicTicketsCreatePayload {
  name: string;
  phone: string;
  message: string;
  locale: string;
  token: string;
  website: string;
  source: {
    page: TicketSourcePage;
    section?: string;
    itemId?: string;
    itemSlug?: string;
    path?: string;
  };
}

export interface AdminTicketsUpdatePayload {
  status?: TicketStatus;
  adminNote?: string;
}

export interface AdminTicketsPaginatedListReadQueryPayload extends PaginationQuery {
  status?: TicketStatus;
  page?: TicketSourcePage;
  q?: string;
}
