import { config } from '../../config/env';
import { logger } from '../logger';

/**
 * Tells the Next.js app that tagged cached fetches are stale. Fire-and-forget: content writes
 * must never fail because the web app is down; pages fall back to time-based revalidation.
 * Tags: 'settings' | 'page:<key>' | 'catalog:types' | 'catalog:type:<slug>' | 'catalog:items' | 'catalog:item:<slug>'
 */
export const triggerRevalidate = (tags: string[]): void => {
  if (!config.revalidate.secret || tags.length === 0) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  fetch(`${config.revalidate.url}/api/revalidate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${config.revalidate.secret}`,
    },
    body: JSON.stringify({ tags }),
    signal: controller.signal,
  })
    .then((res) => {
      if (!res.ok)
        logger.warn({ tags, status: res.status }, 'revalidate rejected');
    })
    .catch((err) => {
      logger.warn(
        { tags, err: err?.message ?? String(err) },
        'revalidate failed',
      );
    })
    .finally(() => clearTimeout(timer));
};
