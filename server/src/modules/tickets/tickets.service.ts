import { createHash } from 'node:crypto';
import { isValidObjectId } from 'mongoose';
import { config } from '../../config/env';
import { ApiError } from '../../core/errors/ApiError';
import { defaultLocale, resolveLocalized } from '../../core/i18n/localized';
import { PaginationParams } from '../../core/pagination';
import { CatalogItem } from '../catalog/catalogItem.model';
import { CatalogType } from '../catalog/catalogType.model';
import { Media } from '../media/media.model';
import { Page } from '../pages/pages.model';
import { PAGE_KEYS } from '../pages/sections.types';
import { TicketCreatePayload, TicketUpdatePayload } from './interface.payload';
import { DashboardResponse } from './interface.response';
import { Ticket, TicketDocument, TicketStatus } from './tickets.model';

interface RequestMeta {
  ip: string;
  userAgent: string;
}

/** Salted, truncated hash: enough to spot floods from one address, never a stored IP. */
export const hashIp = (ip: string): string =>
  createHash('sha256')
    .update(`${ip}${config.ipHashSalt}`)
    .digest('hex')
    .slice(0, 32);

/** Normalises the phone to digits with an optional leading `+`. */
export const normalizePhone = (raw: string): string => {
  const cleaned = raw.replace(/[^\d+]/g, '');
  return cleaned.startsWith('+')
    ? `+${cleaned.slice(1).replace(/\+/g, '')}`
    : cleaned;
};

export const createTicket = async (
  payload: TicketCreatePayload,
  meta: RequestMeta,
): Promise<TicketDocument> => {
  let itemTitle = '';
  let itemSlug = payload.source.itemSlug ?? '';
  if (payload.source.itemId && isValidObjectId(payload.source.itemId)) {
    const item = await CatalogItem.findById(payload.source.itemId).select(
      'title slug',
    );
    if (item) {
      itemTitle = resolveLocalized(item.title, defaultLocale());
      itemSlug = item.slug;
    }
  }
  return Ticket.create({
    name: payload.name,
    phone: normalizePhone(payload.phone),
    message: payload.message ?? '',
    locale: payload.locale ?? defaultLocale(),
    status: 'new',
    source: {
      page: payload.source.page,
      section: payload.source.section ?? '',
      itemId: payload.source.itemId ?? '',
      itemSlug,
      itemTitle,
      path: payload.source.path ?? '',
    },
    meta: { ipHash: hashIp(meta.ip), userAgent: meta.userAgent.slice(0, 256) },
  });
};

interface ListQuery extends PaginationParams {
  status?: string;
  page?: string;
  q?: string;
}

export const listTicketsPaginated = async ({
  limit,
  offset,
  status,
  page,
  q,
}: ListQuery) => {
  const filter: Record<string, unknown> = {};
  if (status && ['new', 'inProgress', 'closed'].includes(status))
    filter.status = status;
  if (page) filter['source.page'] = page;
  if (q?.trim()) {
    const rx = {
      $regex: q
        .trim()
        .slice(0, 60)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
    filter.$or = [
      { name: rx },
      { phone: rx },
      { message: rx },
      { 'source.itemTitle': rx },
    ];
  }
  const [items, total] = await Promise.all([
    Ticket.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec(),
    Ticket.countDocuments(filter).exec(),
  ]);
  return { items, total };
};

export const getTicket = async (id: string): Promise<TicketDocument> => {
  if (!isValidObjectId(id)) throw ApiError.notFound('Ticket not found');
  const ticket = await Ticket.findById(id);
  if (!ticket) throw ApiError.notFound('Ticket not found');
  return ticket;
};

export const updateTicket = async (
  id: string,
  payload: TicketUpdatePayload,
): Promise<TicketDocument> => {
  const ticket = await getTicket(id);
  if (payload.status !== undefined)
    ticket.status = payload.status as TicketStatus;
  if (payload.adminNote !== undefined) ticket.adminNote = payload.adminNote;
  await ticket.save();
  return ticket;
};

export const deleteTicket = async (id: string): Promise<void> => {
  const ticket = await getTicket(id);
  await ticket.deleteOne();
};

export const getDashboard = async (): Promise<DashboardResponse> => {
  const [byStatus, published, draft, types, pagesEnabled, media] =
    await Promise.all([
      Ticket.aggregate<{ _id: TicketStatus; n: number }>([
        { $group: { _id: '$status', n: { $sum: 1 } } },
      ]),
      CatalogItem.countDocuments({ status: 'published' }),
      CatalogItem.countDocuments({ status: 'draft' }),
      CatalogType.countDocuments(),
      Page.countDocuments({ enabled: true }),
      Media.countDocuments(),
    ]);
  const count = (s: TicketStatus) => byStatus.find((r) => r._id === s)?.n ?? 0;
  const tickets = {
    new: count('new'),
    inProgress: count('inProgress'),
    closed: count('closed'),
    total: 0,
  };
  tickets.total = tickets.new + tickets.inProgress + tickets.closed;
  return {
    tickets,
    catalog: { published, draft, types },
    pages: { enabled: pagesEnabled, total: PAGE_KEYS.length },
    media: { total: media },
  };
};
