import { RequestHandler } from 'express';
import {
  buildPaginatedResponse,
  hasPaginationParams,
  parsePagination,
} from '../../core/pagination';
import * as service from './tickets.service';
import { ticketModel2TicketReadResponse } from './adapter.modelToResponse';
import { TicketCreatePayload } from './interface.payload';
import { consumeToken, issueToken } from './tickets.token';

export const token: RequestHandler = (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json(issueToken());
};

/**
 * Public submission. Honeypot hits are answered with the same 201 as a real submission and
 * silently dropped, so a bot cannot tell it was detected.
 */
export const create: RequestHandler = async (req, res) => {
  const payload = req.body as TicketCreatePayload;
  if (payload.website) {
    res.status(201).json({ ok: true });
    return;
  }
  await consumeToken(payload.token);
  const ticket = await service.createTicket(payload, {
    ip: req.ip ?? '',
    userAgent: String(req.headers['user-agent'] ?? ''),
  });
  res.status(201).json({ ok: true, id: String(ticket._id) });
};

export const list: RequestHandler = async (req, res) => {
  const params = hasPaginationParams(req.query)
    ? parsePagination(req.query)
    : { limit: 20, offset: 0 };
  const str = (k: string) =>
    typeof req.query[k] === 'string' ? (req.query[k] as string) : undefined;
  const { items, total } = await service.listTicketsPaginated({
    ...params,
    status: str('status'),
    page: str('page'),
    q: str('q'),
  });
  res.json(
    buildPaginatedResponse(
      items.map(ticketModel2TicketReadResponse),
      total,
      params,
    ),
  );
};

export const read: RequestHandler = async (req, res) => {
  res.json(
    ticketModel2TicketReadResponse(
      await service.getTicket(String(req.params.id)),
    ),
  );
};

export const update: RequestHandler = async (req, res) => {
  res.json(
    ticketModel2TicketReadResponse(
      await service.updateTicket(String(req.params.id), req.body),
    ),
  );
};

export const remove: RequestHandler = async (req, res) => {
  await service.deleteTicket(String(req.params.id));
  res.json({ success: true });
};

export const dashboard: RequestHandler = async (_req, res) => {
  res.json(await service.getDashboard());
};
