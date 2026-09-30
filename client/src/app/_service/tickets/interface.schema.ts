import type { PaginatedMeta } from '@/lib/pagination';
import type { TicketSourcePage, TicketStatus } from './interface.response';

export interface TicketSchema {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketPaginatedListSchema extends PaginatedMeta {
  data: TicketSchema[];
}

export interface TicketTokenSchema {
  token: string;
  minDelayMs: number;
  issuedAt: number;
}

export interface DashboardSchema {
  tickets: { new: number; inProgress: number; closed: number; total: number };
  catalog: { published: number; draft: number; types: number };
  pages: { enabled: number; total: number };
  media: { total: number };
}
