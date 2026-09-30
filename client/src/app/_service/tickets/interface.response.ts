import type { PaginatedResponse } from '../interface.response';

export const TICKET_STATUSES = ['new', 'inProgress', 'closed'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];
export const TICKET_SOURCE_PAGES = [
  'landing',
  'about',
  'contact',
  'catalog',
  'catalogItem',
] as const;
export type TicketSourcePage = (typeof TICKET_SOURCE_PAGES)[number];

export interface PublicTicketsTokenReadResponse {
  token: string;
  minDelayMs: number;
}

export interface PublicTicketsCreateResponse {
  ok: boolean;
  id?: string;
}

export interface AdminTicketsReadResponse {
  id: string;
  name: string;
  phone: string;
  message: string;
  locale: string;
  status: TicketStatus;
  adminNote: string;
  source: {
    page: TicketSourcePage;
    section: string;
    itemId: string;
    itemSlug: string;
    itemTitle: string;
    path: string;
  };
  userAgent: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminTicketsPaginatedListReadResponse = PaginatedResponse<AdminTicketsReadResponse>;

export interface AdminDashboardReadResponse {
  tickets: { new: number; inProgress: number; closed: number; total: number };
  catalog: { published: number; draft: number; types: number };
  pages: { enabled: number; total: number };
  media: { total: number };
}
