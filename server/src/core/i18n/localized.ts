import { Schema } from 'mongoose';
import { config } from '../../config/env';
import { isLocaleCode, LocaleCode, LocalizedString } from './types';

/** Schema fragment for a localized text field. */
export const localizedStringSchema = () => ({
  type: Map,
  of: String,
  default: () => new Map<string, string>(),
});

/** Mongoose Maps serialise to `{}` with JSON.stringify — adapters must go through this. */
export const mapToObject = (value: unknown): LocalizedString => {
  if (!value) return {};
  const entries =
    value instanceof Map
      ? [...value.entries()]
      : Object.entries(value as object);
  const out: LocalizedString = {};
  for (const [k, v] of entries) {
    if (isLocaleCode(k) && typeof v === 'string') out[k] = v;
  }
  return out;
};

export const defaultLocale = (): LocaleCode =>
  isLocaleCode(config.defaultLocale) ? config.defaultLocale : 'fa';

/** Picks the requested locale, then the default locale, then any non-empty value. */
export const resolveLocalized = (
  value: unknown,
  locale: LocaleCode,
): string => {
  const obj = mapToObject(value);
  return (
    obj[locale] ||
    obj[defaultLocale()] ||
    Object.values(obj).find(Boolean) ||
    ''
  );
};

/** Drops empty strings so partially filled translations fall back cleanly on the public site. */
export const cleanLocalized = (
  value: LocalizedString | undefined,
): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value ?? {})) {
    if (isLocaleCode(k) && typeof v === 'string' && v.trim()) out[k] = v.trim();
  }
  return out;
};

export { Schema };
