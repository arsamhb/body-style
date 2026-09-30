import type { TicketFormSchema, TicketSource, TicketTriageFormSchema } from './interface.form';
import type { AdminTicketsUpdatePayload, PublicTicketsCreatePayload } from './interface.payload';

export const ticketFormSchema2PublicTicketsCreatePayload = (
  form: TicketFormSchema,
  ctx: { token: string; locale: string; source: TicketSource; path: string }
): PublicTicketsCreatePayload => ({
  name: form.name.trim(),
  phone: form.phone.trim(),
  message: form.message.trim(),
  locale: ctx.locale,
  token: ctx.token,
  website: form.website,
  source: {
    page: ctx.source.page,
    section: ctx.source.section,
    itemId: ctx.source.itemId,
    itemSlug: ctx.source.itemSlug,
    path: ctx.path.slice(0, 200),
  },
});

export const ticketTriageFormSchema2AdminTicketsUpdatePayload = (
  form: TicketTriageFormSchema
): AdminTicketsUpdatePayload => ({
  status: form.status,
  adminNote: form.adminNote.trim(),
});
