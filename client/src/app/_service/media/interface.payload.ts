import type { LocalizedString } from '@/lib/i18n/types';
import type { PaginationQuery } from '@/lib/pagination';

export type AdminMediaPaginatedListReadQueryPayload = PaginationQuery;

export interface AdminMediaUpdatePayload {
  alt: LocalizedString;
}
