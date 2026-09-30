import type { LocalizedString } from '@/lib/i18n/types';
import type { SectionType } from '@/features/sections/types';

export interface AdminPagesSeoUpdatePayload {
  title: LocalizedString;
  description: LocalizedString;
  ogImageUrl: string;
}

export interface AdminPagesEnabledUpdatePayload {
  enabled: boolean;
}

export interface AdminPagesSectionsCreatePayload {
  type: SectionType;
  key?: string;
  props?: Record<string, unknown>;
}

export interface AdminPagesSectionsUpdatePayload {
  enabled?: boolean;
  key?: string;
  props?: Record<string, unknown>;
}

export interface AdminPagesSectionsReorderPayload {
  orderedIds: string[];
}
