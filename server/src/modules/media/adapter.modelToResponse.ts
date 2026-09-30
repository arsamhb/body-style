import { mapToObject } from '../../core/i18n/localized';
import { MediaDocument } from './media.model';
import { MediaReadResponse } from './interface.response';

export const mediaModel2MediaReadResponse = (
  media: MediaDocument,
): MediaReadResponse => ({
  id: String(media._id),
  url: media.url,
  thumbUrl: media.thumbUrl,
  mime: media.mime,
  width: media.width,
  height: media.height,
  size: media.size,
  alt: mapToObject(media.alt),
  originalName: media.originalName,
  createdAt: media.createdAt.toISOString(),
});
