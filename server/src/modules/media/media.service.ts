import { randomBytes } from 'node:crypto';
import { isValidObjectId } from 'mongoose';
import sharp from 'sharp';
import { ApiError } from '../../core/errors/ApiError';
import { cleanLocalized } from '../../core/i18n/localized';
import { LocalizedString } from '../../core/i18n/types';
import { PaginationParams } from '../../core/pagination';
import { storage } from '../../core/storage';
import { Media, MediaDocument } from './media.model';

const MAX_EDGE = 2400;
const THUMB_EDGE = 480;
const WEBP_QUALITY = 82;

const newKey = (suffix = ''): string => {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${yyyy}/${mm}/${Date.now()}-${randomBytes(8).toString('hex')}${suffix}.webp`;
};

const findByIdOrThrow = async (id: string): Promise<MediaDocument> => {
  if (!isValidObjectId(id)) throw ApiError.notFound('Media not found');
  const media = await Media.findById(id);
  if (!media) throw ApiError.notFound('Media not found');
  return media;
};

export const listMediaPaginated = async ({
  limit,
  offset,
}: PaginationParams) => {
  const [items, total] = await Promise.all([
    Media.find().sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
    Media.countDocuments().exec(),
  ]);
  return { items, total };
};

export const getMedia = (id: string) => findByIdOrThrow(id);

interface UploadInput {
  buffer: Buffer;
  originalName: string;
  alt?: LocalizedString;
  uploadedBy?: string;
}

/**
 * Validates the bytes with sharp (the declared mimetype is not trusted), then stores a
 * size-capped WebP plus a thumbnail. Animated GIFs lose animation by design.
 */
export const uploadImage = async ({
  buffer,
  originalName,
  alt,
  uploadedBy,
}: UploadInput) => {
  let meta: sharp.Metadata;
  try {
    meta = await sharp(buffer).metadata();
  } catch {
    throw ApiError.validation([
      { field: 'file', code: 'invalid', message: 'File is not a valid image' },
    ]);
  }
  if (
    !meta.format ||
    !['jpeg', 'png', 'webp', 'avif', 'gif'].includes(meta.format)
  ) {
    throw ApiError.validation([
      { field: 'file', code: 'format', message: 'Unsupported image format' },
    ]);
  }

  const main = sharp(buffer).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: 'inside',
    withoutEnlargement: true,
  });
  const { data, info } = await main
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });
  const thumb = await sharp(buffer)
    .rotate()
    .resize({
      width: THUMB_EDGE,
      height: THUMB_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 78 })
    .toBuffer();

  const key = newKey();
  const thumbKey = key.replace(/\.webp$/, '-thumb.webp');
  const [{ url }, { url: thumbUrl }] = await Promise.all([
    storage.put(key, data, 'image/webp'),
    storage.put(thumbKey, thumb, 'image/webp'),
  ]);

  return Media.create({
    key,
    url,
    thumbKey,
    thumbUrl,
    mime: 'image/webp',
    width: info.width,
    height: info.height,
    size: info.size,
    alt: cleanLocalized(alt),
    originalName: originalName.slice(0, 255),
    uploadedBy:
      uploadedBy && isValidObjectId(uploadedBy) ? uploadedBy : undefined,
  });
};

export const updateMediaAlt = async (id: string, alt: LocalizedString) => {
  const media = await findByIdOrThrow(id);
  media.alt = new Map(Object.entries(cleanLocalized(alt)));
  await media.save();
  return media;
};

/** Deletion is by id only; the stored key (never a client path) is what gets removed. */
export const deleteMedia = async (id: string): Promise<void> => {
  const media = await findByIdOrThrow(id);
  await Promise.all([
    storage.remove(media.key),
    storage.remove(media.thumbKey),
  ]);
  await media.deleteOne();
};
