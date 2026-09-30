import type { LocalizedString } from '@/lib/i18n/types';

export interface PageSeoFormSchema {
  title: LocalizedString;
  description: LocalizedString;
  ogImageUrl: string;
}

/** Section editor values are the section's props object itself (shape depends on the type). */
export type SectionPropsFormSchema = Record<string, unknown>;
