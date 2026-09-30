import type { LocaleCode } from '@/i18n/routing';
import { LOCALE_META } from '@/lib/i18n/locales';
import type { PublicSpec } from './types';

export interface SpecLabels {
  yes: string;
  no: string;
}

/** Human-readable spec value for the current locale (numbers get locale digits and units). */
export const formatSpecValue = (
  spec: PublicSpec,
  locale: LocaleCode,
  labels: SpecLabels
): string => {
  const nf = new Intl.NumberFormat(LOCALE_META[locale].bcp47, { maximumFractionDigits: 2 });
  switch (spec.type) {
    case 'number':
      return `${nf.format(Number(spec.value))}${spec.unit ? ` ${spec.unit}` : ''}`;
    case 'price':
      return `${nf.format(Number(spec.value))}${spec.currency ? ` ${spec.currency}` : ''}`;
    case 'boolean':
      return spec.value ? labels.yes : labels.no;
    case 'select':
    case 'multiselect':
      return (
        spec.valueLabel ?? (Array.isArray(spec.value) ? spec.value.join('، ') : String(spec.value))
      );
    case 'url':
      try {
        return new URL(String(spec.value)).hostname;
      } catch {
        return String(spec.value);
      }
    default:
      return String(spec.value);
  }
};
