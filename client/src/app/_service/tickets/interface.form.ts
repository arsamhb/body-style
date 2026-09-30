import type { TicketSourcePage } from './interface.response';

export interface TicketSource {
  page: TicketSourcePage;
  section?: string;
  itemId?: string;
  itemSlug?: string;
  itemTitle?: string;
}

export interface TicketFormSchema {
  name: string;
  phone: string;
  message: string;
  /** Honeypot: must stay empty. */
  website: string;
}

export interface TicketTriageFormSchema {
  status: 'new' | 'inProgress' | 'closed';
  adminNote: string;
}
