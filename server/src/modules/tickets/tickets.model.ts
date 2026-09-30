import { Schema, model, Document } from 'mongoose';

export const TICKET_STATUSES = ['new', 'inProgress', 'closed'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_SOURCE_PAGES = [
  'landing',
  'about',
  'contact',
  'catalog',
  'catalogItem',
] as const;
export type TicketSourcePage = (typeof TICKET_SOURCE_PAGES)[number];

export interface TicketDocument extends Document {
  name: string;
  phone: string;
  message: string;
  locale: string;
  status: TicketStatus;
  adminNote: string;
  /** Where on the site the form lived, so the inbox can tell what prompted the request. */
  source: {
    page: TicketSourcePage;
    section: string;
    itemId: string;
    itemSlug: string;
    itemTitle: string;
    path: string;
  };
  meta: { ipHash: string; userAgent: string };
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<TicketDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 24 },
    message: { type: String, default: '', maxlength: 1000 },
    locale: { type: String, default: 'fa', maxlength: 8 },
    status: { type: String, enum: TICKET_STATUSES, default: 'new' },
    adminNote: { type: String, default: '', maxlength: 2000 },
    source: {
      page: { type: String, enum: TICKET_SOURCE_PAGES, required: true },
      section: { type: String, default: '', maxlength: 60 },
      itemId: { type: String, default: '', maxlength: 24 },
      itemSlug: { type: String, default: '', maxlength: 80 },
      itemTitle: { type: String, default: '', maxlength: 160 },
      path: { type: String, default: '', maxlength: 200 },
    },
    meta: {
      ipHash: { type: String, default: '' },
      userAgent: { type: String, default: '', maxlength: 256 },
    },
  },
  { timestamps: true },
);

ticketSchema.index({ status: 1, createdAt: -1 });
ticketSchema.index({ 'source.page': 1, createdAt: -1 });

export const Ticket = model<TicketDocument>('Ticket', ticketSchema);

/** Consumed form tokens. The TTL index expires rows after the token's own validity window. */
export interface TicketNonceDocument extends Document {
  nonce: string;
  expiresAt: Date;
}

const ticketNonceSchema = new Schema<TicketNonceDocument>({
  nonce: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});
ticketNonceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TicketNonce = model<TicketNonceDocument>(
  'TicketNonce',
  ticketNonceSchema,
);
