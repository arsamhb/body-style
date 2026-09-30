import type { LocaleCode } from '@/i18n/routing';

export type TextDirection = 'rtl' | 'ltr';

export interface LocaleMeta {
  code: LocaleCode;
  dir: TextDirection;
  /** Name of the language in that language, used by the locale switcher. */
  nativeLabel: string;
  /** Font stack head, must match a variable exposed by `lib/fonts.ts`. */
  fontVariable: '--font-vazirmatn' | '--font-inter';
  /** BCP 47 tag for `hreflang`, `Intl` formatting, and Open Graph. */
  bcp47: string;
}

export const LOCALE_META: Record<LocaleCode, LocaleMeta> = {
  fa: {
    code: 'fa',
    dir: 'rtl',
    nativeLabel: 'فارسی',
    fontVariable: '--font-vazirmatn',
    bcp47: 'fa-IR',
  },
  en: {
    code: 'en',
    dir: 'ltr',
    nativeLabel: 'English',
    fontVariable: '--font-inter',
    bcp47: 'en-US',
  },
};

export const getDirection = (locale: LocaleCode): TextDirection => LOCALE_META[locale].dir;
