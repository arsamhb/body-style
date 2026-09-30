import { TicketSourcePage, TicketStatus } from './tickets.model';

export interface TicketReadResponse {
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

export interface TicketTokenResponse {
  token: string;
  minDelayMs: number;
}

export interface DashboardResponse {
  tickets: { new: number; inProgress: number; closed: number; total: number };
  catalog: { published: number; draft: number; types: number };
  pages: { enabled: number; total: number };
  media: { total: number };
}
