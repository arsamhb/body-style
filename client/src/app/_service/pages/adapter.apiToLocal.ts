import type { AdminSection } from '@/features/sections/types';
import type {
  AdminPagesListReadResponse,
  AdminPagesReadResponse,
  AdminPagesSummaryResponse,
} from './interface.response';
import type { PageSchema, PageSummaryListSchema, PageSummarySchema } from './interface.schema';

export const adminPagesReadResponse2PageSchema = (api: AdminPagesReadResponse): PageSchema => ({
  key: api.key,
  enabled: api.enabled,
  seo: {
    title: api.seo?.title ?? {},
    description: api.seo?.description ?? {},
    ogImageUrl: api.seo?.ogImageUrl ?? '',
  },
  sections: (api.sections ?? []) as AdminSection[],
  allowedSectionTypes: api.allowedSectionTypes ?? [],
  updatedAt: new Date(api.updatedAt),
  createdSectionId: api.createdSectionId,
});

export const adminPagesSummaryResponse2PageSummarySchema = (
  api: AdminPagesSummaryResponse
): PageSummarySchema => ({
  key: api.key,
  enabled: api.enabled,
  sectionCount: api.sectionCount,
  enabledSectionCount: api.enabledSectionCount,
  updatedAt: new Date(api.updatedAt),
});

export const adminPagesListReadResponse2PageSummaryListSchema = (
  api: AdminPagesListReadResponse
): PageSummaryListSchema => api.map(adminPagesSummaryResponse2PageSummarySchema);
