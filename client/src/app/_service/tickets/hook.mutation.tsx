import api from '@/lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { adminTicketsReadResponse2TicketSchema } from './adapter.apiToLocal';
import { ticketTriageFormSchema2AdminTicketsUpdatePayload } from './adapter.localToApi';
import type { TicketTriageFormSchema } from './interface.form';
import type { PublicTicketsCreatePayload } from './interface.payload';
import type { PublicTicketsCreateResponse } from './interface.response';
import type { TicketSchema } from './interface.schema';
import { getAdminTicketsRouteById, PUBLIC_TICKETS_ROUTE } from './route.api';

/** Raw payload in: the form builds it with the token/source context (see adapter.localToApi). */
const usePostPublicTickets = (onSuccess?: (data: PublicTicketsCreateResponse) => void) =>
  useMutation({
    mutationKey: ['post-public-tickets'],
    mutationFn: ({ payload }: { payload: PublicTicketsCreatePayload }) =>
      api.post<PublicTicketsCreatePayload, PublicTicketsCreateResponse>(PUBLIC_TICKETS_ROUTE)(
        payload
      ),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminTicketsById = (onSuccess?: (data: TicketSchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-tickets-by-id'],
    mutationFn: ({ id, payload }: { id: string; payload: TicketTriageFormSchema }) =>
      api.patch<TicketTriageFormSchema, TicketSchema>(
        getAdminTicketsRouteById(id),
        ticketTriageFormSchema2AdminTicketsUpdatePayload,
        adminTicketsReadResponse2TicketSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminTicketsStatusById = (onSuccess?: (data: TicketSchema) => void) =>
  useMutation({
    mutationKey: ['patch-admin-tickets-status-by-id'],
    mutationFn: ({ id, status }: { id: string; status: TicketSchema['status'] }) =>
      api.patch<{ status: TicketSchema['status'] }, TicketSchema>(
        getAdminTicketsRouteById(id),
        (p) => p,
        adminTicketsReadResponse2TicketSchema
      )({ status }),
    onSuccess: (data) => onSuccess?.(data),
  });

const useDeleteAdminTicketsById = (onSuccess?: () => void) =>
  useMutation({
    mutationKey: ['delete-admin-tickets-by-id'],
    mutationFn: ({ id }: { id: string }) => api.delete(getAdminTicketsRouteById(id))(),
    onSuccess: () => onSuccess?.(),
  });

export {
  useDeleteAdminTicketsById,
  usePatchAdminTicketsById,
  usePatchAdminTicketsStatusById,
  usePostPublicTickets,
};
