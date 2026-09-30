import { LocalizedString } from '../../core/i18n/types';

/**
 * Mirror of `client/src/features/sections/types.ts`. The `type` union is the contract between
 * the API (validation, defaults) and the web app (renderers, editors). Keep both in sync.
 */
export const PAGE_KEYS = ['landing', 'about', 'contact', 'catalog'] as const;
export type PageKey = (typeof PAGE_KEYS)[number];
export const isPageKey = (v: unknown): v is PageKey =>
  typeof v === 'string' && (PAGE_KEYS as readonly string[]).includes(v);

export const SECTION_TYPES = [
  'hero',
  'intro',
  'features',
  'catalogHighlights',
  'samples',
  'stats',
  'testimonials',
  'partners',
  'ctaBanner',
  'faq',
  'ticketForm',
  'aboutHero',
  'missionVision',
  'achievements',
  'contactHero',
  'contactInfo',
  'map',
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];
export const isSectionType = (v: unknown): v is SectionType =>
  typeof v === 'string' && (SECTION_TYPES as readonly string[]).includes(v);

/** Which section types each page may contain (developer picks from this list when adding). */
export const ALLOWED_ON_PAGE: Record<PageKey, SectionType[]> = {
  landing: [
    'hero',
    'intro',
    'features',
    'catalogHighlights',
    'samples',
    'stats',
    'testimonials',
    'partners',
    'faq',
    'ctaBanner',
    'ticketForm',
    'map',
  ],
  about: [
    'aboutHero',
    'intro',
    'missionVision',
    'achievements',
    'stats',
    'testimonials',
    'partners',
    'ctaBanner',
    'ticketForm',
  ],
  contact: ['contactHero', 'contactInfo', 'ticketForm', 'map', 'faq'],
  catalog: ['intro', 'faq', 'ctaBanner', 'ticketForm'],
};

export interface SectionBase {
  id: string;
  key: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  /** Validated per type by `sections.registry.ts`; localized fields are stored as plain maps. */
  props: Record<string, unknown>;
}

export interface PageSeo {
  title: LocalizedString;
  description: LocalizedString;
  ogImageUrl: string;
}
