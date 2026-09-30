import { RequestHandler } from 'express';

/**
 * Wraps an async route handler so a rejected promise is forwarded to the error middleware
 * instead of crashing the request. (Express 5 auto-forwards, but wrapping keeps intent explicit.)
 */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
