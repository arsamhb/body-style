import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { config } from '../../config/env';
import { ApiError } from '../../core/errors/ApiError';
import { TicketNonce } from './tickets.model';

/**
 * Anti-abuse form token: `<issuedAtMs>.<nonce>.<hmac>`.
 *  - The form fetches one on mount; bots that POST immediately fail the minimum age.
 *  - Signed with a server secret, so it cannot be forged; single-use via the nonce store.
 *  - Bounded lifetime, so a harvested token is useless after an hour.
 * No cookies or sessions involved, which keeps the public pages fully cacheable.
 */
export const TOKEN_MIN_AGE_MS = 3 * 1000;
export const TOKEN_MAX_AGE_MS = 60 * 60 * 1000;

export const TokenError = {
  INVALID: 'TOKEN_INVALID',
  TOO_EARLY: 'TOKEN_TOO_EARLY',
  EXPIRED: 'TOKEN_EXPIRED',
  USED: 'TOKEN_USED',
} as const;

const sign = (issuedAt: string, nonce: string): string =>
  createHmac('sha256', config.ticketTokenSecret)
    .update(`${issuedAt}.${nonce}`)
    .digest('base64url');

export const issueToken = (): { token: string; minDelayMs: number } => {
  const issuedAt = String(Date.now());
  const nonce = randomBytes(12).toString('base64url');
  return {
    token: `${issuedAt}.${nonce}.${sign(issuedAt, nonce)}`,
    minDelayMs: TOKEN_MIN_AGE_MS,
  };
};

/** Verifies signature and age window, then burns the nonce. Throws ApiError(400, TOKEN_*). */
export const consumeToken = async (token: string): Promise<void> => {
  const parts = token.split('.');
  if (parts.length !== 3)
    throw ApiError.badRequest('Invalid form token', TokenError.INVALID);
  const [issuedAt, nonce, mac] = parts;
  const expected = sign(issuedAt, nonce);
  if (
    mac.length !== expected.length ||
    !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))
  ) {
    throw ApiError.badRequest('Invalid form token', TokenError.INVALID);
  }
  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age))
    throw ApiError.badRequest('Invalid form token', TokenError.INVALID);
  if (age < TOKEN_MIN_AGE_MS)
    throw ApiError.badRequest(
      'Form submitted too quickly',
      TokenError.TOO_EARLY,
    );
  if (age > TOKEN_MAX_AGE_MS)
    throw ApiError.badRequest('Form token expired', TokenError.EXPIRED);
  try {
    await TicketNonce.create({
      nonce,
      expiresAt: new Date(Number(issuedAt) + TOKEN_MAX_AGE_MS),
    });
  } catch (e) {
    if ((e as { code?: number }).code === 11000)
      throw ApiError.badRequest('Form token already used', TokenError.USED);
    throw e;
  }
};
