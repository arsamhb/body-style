import type {
  AdminMediaPaginatedListReadResponse,
  AdminMediaReadResponse,
} from './interface.response';
import type { MediaPaginatedListSchema, MediaSchema } from './interface.schema';

export const adminMediaReadResponse2MediaSchema = (api: AdminMediaReadResponse): MediaSchema => ({
  id: api.id,
  url: api.url,
  thumbUrl: api.thumbUrl,
  mime: api.mime,
  width: api.width,
  height: api.height,
  size: api.size,
  alt: api.alt ?? {},
  originalName: api.originalName ?? '',
  createdAt: new Date(api.createdAt),
});

export const adminMediaPaginatedListReadResponse2MediaPaginatedListSchema = (
  api: AdminMediaPaginatedListReadResponse
): MediaPaginatedListSchema => ({
  data: api.data.map(adminMediaReadResponse2MediaSchema),
  total: api.total,
  limit: api.limit,
  offset: api.offset,
  total_pages: api.total_pages,
});
