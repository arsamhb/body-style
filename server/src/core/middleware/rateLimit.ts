import { rateLimit } from 'express-rate-limit';
import { ApiError } from '../errors/ApiError';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const make = (limit: number, windowMs = FIFTEEN_MINUTES) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // Reply with the API's error envelope instead of the default text body.
    handler: (_req, _res, next) => next(ApiError.tooManyRequests()),
  });

/** Brute-force protection for credentials. */
export const loginLimiter = make(10);
/** Refresh is cheap but should not be hammered. */
export const refreshLimiter = make(60);
/** Public ticket submissions per IP. */
export const ticketLimiter = make(5);
/** Anti-abuse token issuance for the ticket form. */
export const tokenLimiter = make(30);
