import { LocalizedString } from '../../core/i18n/types';

/** Shorthand for bilingual seed copy. */
export const L = (fa: string, en: string): LocalizedString => ({ fa, en });

/** Placeholder images shipped with the web app (served by Next from /public). */
export const P = '/img/placeholders';
