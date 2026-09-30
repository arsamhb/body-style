/** Mirror of `client/src/i18n/routing.ts`. Keep the two lists identical. */
export const SUPPORTED_LOCALES = ['fa', 'en'] as const;
export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

/** Per-locale text as stored (Mongoose Map) and as exchanged with the admin panel. */
export type LocalizedString = Partial<Record<LocaleCode, string>>;

export const isLocaleCode = (value: unknown): value is LocaleCode =>
  typeof value === 'string' &&
  (SUPPORTED_LOCALES as readonly string[]).includes(value);
