import { LocalizedString } from '../../core/i18n/types';

/** Shorthand for bilingual seed copy. */
export const L = (fa: string, en: string): LocalizedString => ({ fa, en });

/** Placeholder images shipped with the web app (served by Next from /public). */
export const P = '/img/placeholders';

/**
 * Search the site (or grep the seeds) for this word. It marks copy, facts, or photos the client
 * has not supplied yet. Only what is in ./content is real; everything else carries this marker.
 */
export const MISSING = 'MISSING';

/** Bilingual placeholder that says what is still needed from the client. */
export const missing = (fa: string, en: string): LocalizedString =>
  L(`${MISSING}: ${fa}`, `${MISSING}: ${en}`);
