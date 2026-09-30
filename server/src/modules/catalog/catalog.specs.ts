import { ApiError, ApiErrorDetail } from '../../core/errors/ApiError';
import { LocaleCode } from '../../core/i18n/types';
import {
  BUILTIN_SORT_KEYS,
  FilterConfig,
  SpecDefinition,
  SpecValue,
  SpecValues,
} from './catalog.types';

/** URL-safe, Unicode-aware slug (keeps Persian letters; the browser encodes them). */
export const slugify = (input: string): string =>
  input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‌‍]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const isHttpUrl = (v: string) => /^https?:\/\/[^\s]+$/i.test(v);
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Coerces and validates an item's `specs` against the type's definitions.
 * Unknown keys are dropped; wrong types, unknown options and missing required specs are errors.
 */
export const validateSpecs = (
  defs: SpecDefinition[],
  raw: unknown,
): SpecValues => {
  const input =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const out: SpecValues = {};
  const errors: ApiErrorDetail[] = [];
  const fail = (key: string, code: string, message: string) =>
    errors.push({ field: `specs.${key}`, code, message });

  for (const def of defs) {
    const value = input[def.key];
    const empty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);
    if (empty) {
      if (def.required) fail(def.key, 'required', 'This spec is required');
      continue;
    }
    switch (def.type) {
      case 'text': {
        if (typeof value !== 'string') fail(def.key, 'type', 'Must be text');
        else if (value.length > 500) fail(def.key, 'max', 'Max 500 characters');
        else out[def.key] = value.trim();
        break;
      }
      case 'url': {
        if (typeof value !== 'string' || !isHttpUrl(value))
          fail(def.key, 'url', 'Must be an http(s) URL');
        else out[def.key] = value.trim();
        break;
      }
      case 'number':
      case 'price': {
        const n = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(n)) fail(def.key, 'number', 'Must be a number');
        else out[def.key] = n;
        break;
      }
      case 'boolean': {
        if (typeof value === 'boolean') out[def.key] = value;
        else if (value === 'true' || value === 'false')
          out[def.key] = value === 'true';
        else fail(def.key, 'boolean', 'Must be true or false');
        break;
      }
      case 'select': {
        const allowed = def.options.map((o) => o.value);
        if (typeof value !== 'string' || !allowed.includes(value))
          fail(def.key, 'option', 'Unknown option');
        else out[def.key] = value;
        break;
      }
      case 'multiselect': {
        const allowed = def.options.map((o) => o.value);
        const list = Array.isArray(value) ? value : [value];
        if (!list.every((v) => typeof v === 'string' && allowed.includes(v)))
          fail(def.key, 'option', 'Unknown option');
        else out[def.key] = [...new Set(list as string[])];
        break;
      }
    }
  }
  if (errors.length) throw ApiError.validation(errors);
  return out;
};

const first = (v: unknown): string | undefined => {
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === 'string' ? s : undefined;
};

/**
 * Builds the Mongo filter for a public listing. Iterates ONLY over spec definitions the developer
 * marked filterable and enabled — never over the query keys — so nothing outside the whitelist
 * can reach the database. Values are coerced by spec type and options are re-checked.
 */
export const buildSpecFilter = (
  defs: SpecDefinition[],
  filterConfig: FilterConfig,
  query: Record<string, unknown>,
): Record<string, unknown>[] => {
  const conditions: Record<string, unknown>[] = [];
  const allowed = defs.filter(
    (d) => d.filterable && filterConfig.enabledFilterKeys.includes(d.key),
  );

  for (const def of allowed) {
    const base = `spec.${def.key}`;
    const field = `specs.${def.key}`;
    const raw = first(query[base]);
    switch (def.type) {
      case 'select':
      case 'multiselect': {
        if (!raw) break;
        const allowedValues = def.options.map((o) => o.value);
        const wanted = raw.split(',').filter((v) => allowedValues.includes(v));
        if (wanted.length) conditions.push({ [field]: { $in: wanted } });
        break;
      }
      case 'number':
      case 'price': {
        const min = Number(first(query[`${base}.min`]));
        const max = Number(first(query[`${base}.max`]));
        const range: Record<string, number> = {};
        if (Number.isFinite(min)) range.$gte = min;
        if (Number.isFinite(max)) range.$lte = max;
        if (Object.keys(range).length) conditions.push({ [field]: range });
        break;
      }
      case 'boolean': {
        if (raw === 'true' || raw === 'false')
          conditions.push({ [field]: raw === 'true' });
        break;
      }
      case 'text': {
        if (!raw) break;
        const needle = raw.trim().slice(0, 40);
        if (needle)
          conditions.push({
            [field]: { $regex: escapeRegex(needle), $options: 'i' },
          });
        break;
      }
      case 'url':
        break;
    }
  }
  return conditions;
};

/** `sort=key:asc|desc` restricted to built-ins + developer-enabled spec keys. */
export const buildSort = (
  filterConfig: FilterConfig,
  raw: unknown,
  locale: LocaleCode,
): Record<string, 1 | -1> => {
  const fallback: Record<string, 1 | -1> = {
    featured: -1,
    order: 1,
    createdAt: -1,
  };
  const value = first(raw);
  if (!value) return fallback;
  const [key, dir] = value.split(':');
  const direction: 1 | -1 = dir === 'desc' ? -1 : 1;
  if ((BUILTIN_SORT_KEYS as readonly string[]).includes(key)) {
    if (key === 'title') return { [`title.${locale}`]: direction };
    return { [key]: direction };
  }
  if (filterConfig.sortKeys.includes(key))
    return { [`specs.${key}`]: direction };
  return fallback;
};

/** Free-text search on localized title/summary (escaped, bounded). */
export const buildSearch = (
  raw: unknown,
  locale: LocaleCode,
): Record<string, unknown> | null => {
  const q = first(raw)?.trim().slice(0, 60);
  if (!q) return null;
  const rx = { $regex: escapeRegex(q), $options: 'i' };
  return {
    $or: [
      { [`title.${locale}`]: rx },
      { [`summary.${locale}`]: rx },
      { slug: rx },
    ],
  };
};

export const isSpecValue = (v: unknown): v is SpecValue =>
  typeof v === 'string' ||
  typeof v === 'number' ||
  typeof v === 'boolean' ||
  (Array.isArray(v) && v.every((x) => typeof x === 'string'));
