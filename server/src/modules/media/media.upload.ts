import multer from 'multer';
import { config } from '../../config/env';
import { ApiError } from '../../core/errors/ApiError';

export const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];

/**
 * Memory storage: the buffer goes straight to sharp, which re-encodes it. Nothing a client sends
 * is ever written to disk as-is, so polyglot files and embedded scripts never survive the upload.
 */
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploads.maxBytes, files: 1, fields: 5 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      cb(
        ApiError.validation([
          {
            field: 'file',
            code: 'mimetype',
            message: 'Unsupported image type',
          },
        ]),
      );
      return;
    }
    cb(null, true);
  },
});
