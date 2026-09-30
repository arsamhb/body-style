import { LocalizedString } from '../../core/i18n/types';
import { PageKey, SectionType } from './sections.types';

export interface SectionAdminResponse {
  id: string;
  key: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  props: Record<string, unknown>;
}

export interface PageAdminReadResponse {
  key: PageKey;
  enabled: boolean;
  seo: {
    title: LocalizedString;
    description: LocalizedString;
    ogImageUrl: string;
  };
  sections: SectionAdminResponse[];
  allowedSectionTypes: SectionType[];
  updatedAt: string;
}

export interface PageAdminSummaryResponse {
  key: PageKey;
  enabled: boolean;
  sectionCount: number;
  enabledSectionCount: number;
  updatedAt: string;
}

export interface SectionPublicResponse {
  id: string;
  key: string;
  type: SectionType;
  enabled: true;
  order: number;
  props: Record<string, unknown>;
}

export interface PagePublicReadResponse {
  key: PageKey;
  seo: { title: string; description: string; ogImageUrl?: string };
  sections: SectionPublicResponse[];
}
