import type { LocalizedString } from '@/lib/i18n/types';
import type { PageKey } from '@/features/site/types';
import type { AdminSection, SectionType } from '@/features/sections/types';

export interface PageSchema {
  key: PageKey;
  enabled: boolean;
  seo: { title: LocalizedString; description: LocalizedString; ogImageUrl: string };
  sections: AdminSection[];
  allowedSectionTypes: SectionType[];
  updatedAt: Date;
  createdSectionId?: string;
}

export interface PageSummarySchema {
  key: PageKey;
  enabled: boolean;
  sectionCount: number;
  enabledSectionCount: number;
  updatedAt: Date;
}

export type PageSummaryListSchema = PageSummarySchema[];
