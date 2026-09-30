import type { TicketSourcePage, TicketStatus } from '@/app/_service/tickets/interface.response';

export const STATUS_TONE: Record<TicketStatus, 'brand' | 'warning' | 'neutral'> = {
  new: 'brand',
  inProgress: 'warning',
  closed: 'neutral',
};

export const SOURCE_ICON: Record<TicketSourcePage, string> = {
  landing: 'house',
  about: 'users',
  contact: 'phone',
  catalog: 'package',
  catalogItem: 'package',
};
