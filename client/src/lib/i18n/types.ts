import type { LocaleCode } from '@/i18n/routing';

/**
 * Every editable text in the CMS is stored per locale. Public endpoints resolve these to plain
 * strings for the requested locale (with fallback to the default locale); admin endpoints return
 * the whole map so the panel can edit every language.
 */
export type LocalizedString = Partial<Record<LocaleCode, string>>;

export const resolveLocalized = (
  value: LocalizedString | undefined,
  locale: LocaleCode,
  fallback: LocaleCode
): string => value?.[locale] ?? value?.[fallback] ?? Object.values(value ?? {})[0] ?? '';
