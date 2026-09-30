import type { ContactWayType, PublicContactWay } from './types';

const digits = (v: string) => v.replace(/[^\d+]/g, '');
const handle = (v: string) => v.replace(/^@/, '').replace(/^https?:\/\/[^/]+\//, '');
const isHttp = (v: string) => /^https?:\/\//i.test(v);

/** Builds a safe href for a contact way. Returns null when the value should render as plain text. */
export const contactWayHref = (way: Pick<PublicContactWay, 'type' | 'value'>): string | null => {
  const v = way.value.trim();
  if (!v) return null;
  switch (way.type) {
    case 'phone':
      return `tel:${digits(v)}`;
    case 'email':
      return `mailto:${v}`;
    case 'whatsapp':
      return `https://wa.me/${digits(v).replace(/^\+/, '')}`;
    case 'telegram':
      return `https://t.me/${handle(v)}`;
    case 'instagram':
      return `https://instagram.com/${handle(v)}`;
    case 'link':
      return isHttp(v) ? v : null;
    case 'address':
    default:
      return null;
  }
};

export const DEFAULT_CONTACT_ICON: Record<ContactWayType, string> = {
  phone: 'phone',
  email: 'mail',
  link: 'link',
  address: 'map-pin',
  whatsapp: 'message-circle',
  telegram: 'send',
  instagram: 'instagram',
};

export const isExternalHref = (href: string) => /^(https?:)?\/\//i.test(href);
