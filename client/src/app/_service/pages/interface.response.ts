import type { LocalizedString } from '@/lib/i18n/types';
import type { PageKey } from '@/features/site/types';
import type { SectionType } from '@/features/sections/types';

export interface AdminPagesSectionResponse {
  id: string;
  key: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  props: Record<string, unknown>;
}

export interface AdminPagesReadResponse {
  key: PageKey;
  enabled: boolean;
  seo: { title: LocalizedString; description: LocalizedString; ogImageUrl: string };
  sections: AdminPagesSectionResponse[];
  allowedSectionTypes: SectionType[];
  updatedAt: string;
  createdSectionId?: string;
}

export interface AdminPagesSummaryResponse {
  key: PageKey;
  enabled: boolean;
  sectionCount: number;
  enabledSectionCount: number;
  updatedAt: string;
}

export type AdminPagesListReadResponse = AdminPagesSummaryResponse[];
