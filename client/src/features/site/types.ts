import type { LocaleCode } from '@/i18n/routing';

export const CONTACT_WAY_TYPES = [
  'phone',
  'email',
  'link',
  'address',
  'whatsapp',
  'telegram',
  'instagram',
  'hours',
] as const;
export type ContactWayType = (typeof CONTACT_WAY_TYPES)[number];

export const PAGE_KEYS = ['landing', 'about', 'contact', 'catalog'] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

/** Public (locale-resolved) shapes returned by `GET /public/site`. */
export interface PublicNavItem {
  id: string;
  label: string;
  href: string;
}

export interface PublicContactWay {
  id: string;
  type: ContactWayType;
  icon: string;
  label: string;
  value: string;
  description: string;
  showInFooter: boolean;
}

export interface PublicSite {
  siteName: string;
  slogan: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  defaultLocale: LocaleCode;
  enabledLocales: LocaleCode[];
  navbar: PublicNavItem[];
  footer: { quickLinks: PublicNavItem[]; text: string; copyright: string };
  contactWays: PublicContactWay[];
  seo: { titleTemplate: string; description: string; ogImageUrl?: string };
  enabledPages: PageKey[];
}
