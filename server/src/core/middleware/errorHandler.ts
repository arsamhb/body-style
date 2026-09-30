import { ErrorRequestHandler } from 'express';
import { ApiError, ErrorCode } from '../errors/ApiError';
import { logger } from '../logger';

interface ErrorLike {
  name?: string;
  status?: number;
  statusCode?: number;
  code?: number | string;
  type?: string;
  field?: string;
  message?: string;
}

/**
 * Central error middleware. Every failure leaves the API as
 *   { error: { code, message, details? } }
 * with an appropriate HTTP status — the shape the frontend parses in src/lib/api/errors.ts.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json(err.toBody());
    return;
  }

  const e = (err ?? {}) as ErrorLike;

  // Mongoose duplicate-key error → 409 conflict.
  if (e.code === 11000) {
    res.status(409).json(ApiError.conflict().toBody());
    return;
  }

  // body-parser: malformed JSON / oversized body.
  if (e.type === 'entity.parse.failed') {
    res.status(400).json(ApiError.badRequest('Malformed JSON body').toBody());
    return;
  }
  if (e.type === 'entity.too.large') {
    res.status(413).json(ApiError.payloadTooLarge().toBody());
    return;
  }

  // multer upload errors (size/count limits, unexpected field).
  if (e.name === 'MulterError') {
    res.status(400).json(
      ApiError.validation(
        [
          {
            field: e.field ?? 'file',
            code: String(e.code ?? 'invalid'),
            message: e.message ?? 'Invalid upload',
          },
        ],
        'Invalid upload',
      ).toBody(),
    );
    return;
  }

  // http-errors style (serve-static forbids `..` segments with a 403, body-parser, etc.).
  const status =
    typeof e.status === 'number'
      ? e.status
      : typeof e.statusCode === 'number'
        ? e.statusCode
        : undefined;
  if (status && status >= 400 && status < 500) {
    const code =
      status === 403
        ? ErrorCode.FORBIDDEN
        : status === 404
          ? ErrorCode.NOT_FOUND
          : status === 413
            ? ErrorCode.PAYLOAD_TOO_LARGE
            : ErrorCode.BAD_REQUEST;
    res
      .status(status)
      .json({ error: { code, message: e.message ?? 'Request rejected' } });
    return;
  }

  // Mongoose schema/cast errors that slipped past Yup.
  if (e.name === 'ValidationError' || e.name === 'CastError') {
    res
      .status(400)
      .json(ApiError.badRequest(e.message ?? 'Invalid data').toBody());
    return;
  }

  // Anything that reaches this point is a bug or an outage: always logged, in every environment.
  (req.log ?? logger).error({ err }, 'Unhandled error');

  res.status(500).json({
    error: { code: ErrorCode.INTERNAL_ERROR, message: 'Internal server error' },
  });
};
