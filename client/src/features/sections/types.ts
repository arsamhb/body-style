import type { LocaleCode } from '@/i18n/routing';
import type { LocalizedString } from '@/lib/i18n/types';
import type { PageKey, PublicSite } from '@/features/site/types';

/**
 * Section props are written once, generic over the text type:
 *  - `T = string`           → public, locale-resolved (what `/public/pages/:key` returns)
 *  - `T = LocalizedString`  → admin, full per-locale maps (what `/admin/pages/:key` returns)
 * The server keeps the same union in `server/src/modules/pages/sections.registry.ts`.
 */
export interface Cta<T> {
  label: T;
  href: string;
}

export type HeroPattern = 'dots' | 'grid' | 'gradient' | 'none';

export interface SectionPropsByType<T> {
  hero: {
    eyebrow?: T;
    title: T;
    subtitle: T;
    primaryCta?: Cta<T>;
    secondaryCta?: Cta<T>;
    backgroundImage?: string;
    pattern: HeroPattern;
  };
  intro: { heading: T; body: T; image?: string; imagePosition: 'start' | 'end'; cta?: Cta<T> };
  features: {
    eyebrow?: T;
    heading: T;
    text?: T;
    items: { icon: string; title: T; text: T; href?: string }[];
  };
  catalogHighlights: {
    heading: T;
    text?: T;
    typeSlug?: string;
    mode: 'featured' | 'manual';
    itemIds: string[];
    limit: number;
  };
  samples: { heading: T; text?: T; items: { image: string; title: T; text: T; href?: string }[] };
  stats: { items: { value: number; suffix?: string; label: T; icon?: string }[] };
  testimonials: { heading: T; items: { quote: T; author: T; role: T; avatar?: string }[] };
  partners: { heading: T; logos: { image: string; name: string; href?: string }[] };
  ctaBanner: { heading: T; text: T; cta: Cta<T> };
  faq: { heading: T; text?: T; items: { question: T; answer: T }[] };
  ticketForm: { heading: T; text: T };
  aboutHero: { image: string; title: T; subtitle: T };
  missionVision: {
    mission: { title: T; text: T };
    vision: { title: T; text: T };
    image?: string;
  };
  achievements: {
    heading: T;
    text?: T;
    items: { title: T; text: T; year?: number; image?: string; icon?: string }[];
  };
  contactHero: { image: string; title: T; text: T };
  contactInfo: { heading: T; text: T };
  map: { embedUrl?: string; address: T };
}

export type SectionType = keyof SectionPropsByType<string>;

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
] as const satisfies readonly SectionType[];

export interface SectionBase {
  id: string;
  /** Stable human key used by tickets to report their origin, e.g. `landing-ticket`. */
  key: string;
  enabled: boolean;
  order: number;
}

export type SectionOf<T, K extends SectionType = SectionType> = K extends SectionType
  ? SectionBase & { type: K; props: SectionPropsByType<T>[K] }
  : never;

export type PublicSection = SectionOf<string>;
export type AdminSection = SectionOf<LocalizedString>;

/** Hydrated by the server for `catalogHighlights` (Phase 5). */
export interface PublicHighlightItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  href: string;
  badge?: string;
}

export interface PublicPage {
  key: PageKey;
  seo: { title: string; description: string; ogImageUrl?: string };
  sections: PublicSection[];
}

export interface SectionComponentProps<K extends SectionType = SectionType> {
  section: Extract<PublicSection, { type: K }>;
  site: PublicSite;
  locale: LocaleCode;
}
