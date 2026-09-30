import type { TicketFormSchema, TicketTriageFormSchema } from './interface.form';
import type { TicketSchema } from './interface.schema';

export const getTicketFormInitialValue = (): TicketFormSchema => ({
  name: '',
  phone: '',
  message: '',
  website: '',
});

export const getTicketTriageFormInitialValue = (ticket?: TicketSchema): TicketTriageFormSchema => ({
  status: ticket?.status ?? 'new',
  adminNote: ticket?.adminNote ?? '',
});
