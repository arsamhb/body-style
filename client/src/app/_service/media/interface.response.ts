import type { LocalizedString } from '@/lib/i18n/types';
import type { PaginatedResponse } from '../interface.response';

export interface AdminMediaReadResponse {
  id: string;
  url: string;
  thumbUrl: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  alt: LocalizedString;
  originalName: string;
  createdAt: string;
}

export type AdminMediaPaginatedListReadResponse = PaginatedResponse<AdminMediaReadResponse>;
