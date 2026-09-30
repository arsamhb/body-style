import { RequestHandler } from 'express';
import { ApiError } from '../errors/ApiError';

/** Terminal 404 for unmatched routes — funnelled through the same error envelope. */
export const notFound: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
