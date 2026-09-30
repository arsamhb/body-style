import { Request } from 'express';
import { defaultLocale } from './i18n/localized';
import { isLocaleCode, LocaleCode } from './i18n/types';

/** `?locale=` for public endpoints; unknown or missing → default locale. */
export const localeFromRequest = (req: Request): LocaleCode => {
  const raw = req.query.locale;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isLocaleCode(value) ? value : defaultLocale();
};
