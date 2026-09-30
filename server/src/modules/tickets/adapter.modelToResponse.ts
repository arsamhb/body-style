import { TicketDocument } from './tickets.model';
import { TicketReadResponse } from './interface.response';

export const ticketModel2TicketReadResponse = (
  t: TicketDocument,
): TicketReadResponse => ({
  id: String(t._id),
  name: t.name,
  phone: t.phone,
  message: t.message,
  locale: t.locale,
  status: t.status,
  adminNote: t.adminNote,
  source: {
    page: t.source.page,
    section: t.source.section,
    itemId: t.source.itemId,
    itemSlug: t.source.itemSlug,
    itemTitle: t.source.itemTitle,
    path: t.source.path,
  },
  userAgent: t.meta.userAgent,
  createdAt: t.createdAt.toISOString(),
  updatedAt: t.updatedAt.toISOString(),
});
