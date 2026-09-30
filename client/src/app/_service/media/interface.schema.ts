import type { LocalizedString } from '@/lib/i18n/types';
import type { PaginatedMeta } from '@/lib/pagination';

export interface MediaSchema {
  id: string;
  url: string;
  thumbUrl: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  alt: LocalizedString;
  originalName: string;
  createdAt: Date;
}

export interface MediaPaginatedListSchema extends PaginatedMeta {
  data: MediaSchema[];
}
