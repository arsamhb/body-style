import { TicketSourcePage, TicketStatus } from './tickets.model';

export interface TicketCreatePayload {
  name: string;
  phone: string;
  message?: string;
  locale?: string;
  token: string;
  /** Honeypot: must be empty. */
  website?: string;
  source: {
    page: TicketSourcePage;
    section?: string;
    itemId?: string;
    itemSlug?: string;
    path?: string;
  };
}

export interface TicketUpdatePayload {
  status?: TicketStatus;
  adminNote?: string;
}
