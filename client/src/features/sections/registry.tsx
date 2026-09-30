import type { ComponentType } from 'react';
import type { LocaleCode } from '@/i18n/routing';
import type { PageKey, PublicSite } from '@/features/site/types';
import AboutHero from './public/AboutHero';
import Achievements from './public/Achievements';
import CatalogHighlights from './public/CatalogHighlights';
import ContactHero from './public/ContactHero';
import ContactInfo from './public/ContactInfo';
import CtaBanner from './public/CtaBanner';
import Faq from './public/Faq';
import Features from './public/Features';
import Hero from './public/Hero';
import Intro from './public/Intro';
import MapSection from './public/MapSection';
import MissionVision from './public/MissionVision';
import Partners from './public/Partners';
import Samples from './public/Samples';
import Stats from './public/Stats';
import Testimonials from './public/Testimonials';
import TicketFormSection from './public/TicketFormSection';
import type { PublicSection, SectionComponentProps, SectionType } from './types';

type PublicComponent<K extends SectionType> = ComponentType<SectionComponentProps<K>>;

/**
 * Maps a section `type` to its public renderer. The admin side (`admin/<Type>Form.tsx`) is
 * registered separately in Phase 4 so the public bundle never imports Formik.
 */
export const PUBLIC_SECTION_COMPONENTS: { [K in SectionType]: PublicComponent<K> } = {
  hero: Hero,
  intro: Intro,
  features: Features,
  catalogHighlights: CatalogHighlights,
  samples: Samples,
  stats: Stats,
  testimonials: Testimonials,
  partners: Partners,
  ctaBanner: CtaBanner,
  faq: Faq,
  ticketForm: TicketFormSection,
  aboutHero: AboutHero,
  missionVision: MissionVision,
  achievements: Achievements,
  contactHero: ContactHero,
  contactInfo: ContactInfo,
  map: MapSection,
};

interface SectionRendererProps {
  sections: PublicSection[];
  site: PublicSite;
  locale: LocaleCode;
  /** Page key, forwarded to ticket forms so tickets report where they came from. */
  page: PageKey;
}

export const SectionRenderer = ({ sections, site, locale, page }: SectionRendererProps) => (
  <>
    {sections
      .filter((s) => s.enabled)
      .sort((a, b) => a.order - b.order)
      .map((section) => {
        const Component = PUBLIC_SECTION_COMPONENTS[section.type] as ComponentType<
          SectionComponentProps & { page: PageKey }
        >;
        return (
          <Component key={section.id} section={section} site={site} locale={locale} page={page} />
        );
      })}
  </>
);
