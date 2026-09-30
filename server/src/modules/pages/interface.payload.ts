import { LocalizedString } from '../../core/i18n/types';
import { SectionType } from './sections.types';

export interface PageSeoUpdatePayload {
  title?: LocalizedString;
  description?: LocalizedString;
  ogImageUrl?: string;
}

export interface PageEnabledUpdatePayload {
  enabled: boolean;
}

export interface SectionCreatePayload {
  type: SectionType;
  key?: string;
  props?: Record<string, unknown>;
}

export interface SectionUpdatePayload {
  enabled?: boolean;
  key?: string;
  props?: Record<string, unknown>;
}

export interface SectionsReorderPayload {
  orderedIds: string[];
}
