import { mapToObject, resolveLocalized } from '../../core/i18n/localized';
import { isLocaleCode, LocaleCode } from '../../core/i18n/types';
import {
  PageAdminReadResponse,
  PageAdminSummaryResponse,
  PagePublicReadResponse,
  SectionAdminResponse,
  SectionPublicResponse,
} from './interface.response';
import { PageDocument } from './pages.model';
import { ALLOWED_ON_PAGE, SectionBase } from './sections.types';

const byOrder = (a: SectionBase, b: SectionBase) => a.order - b.order;

const sectionAdmin = (s: SectionBase): SectionAdminResponse => ({
  id: s.id,
  key: s.key,
  type: s.type,
  enabled: s.enabled,
  order: s.order,
  props: s.props ?? {},
});

export const pageModel2PageAdminReadResponse = (
  page: PageDocument,
): PageAdminReadResponse => ({
  key: page.key,
  enabled: page.enabled,
  seo: {
    title: mapToObject(page.seo.title),
    description: mapToObject(page.seo.description),
    ogImageUrl: page.seo.ogImageUrl,
  },
  sections: [...page.sections].sort(byOrder).map(sectionAdmin),
  allowedSectionTypes: ALLOWED_ON_PAGE[page.key],
  updatedAt: page.updatedAt.toISOString(),
});

export const pageModel2PageAdminSummaryResponse = (
  page: PageDocument,
): PageAdminSummaryResponse => ({
  key: page.key,
  enabled: page.enabled,
  sectionCount: page.sections.length,
  enabledSectionCount: page.sections.filter((s) => s.enabled).length,
  updatedAt: page.updatedAt.toISOString(),
});

/**
 * Localized fields are stored as plain `{ fa, en }` objects inside `props`. The validation layer
 * guarantees that the only objects whose keys are all locale codes are LocalizedStrings, so a
 * generic walk can resolve them (an empty `{}` is an untranslated localized field → '').
 */
const isLocalizedObject = (value: object): boolean => {
  const keys = Object.keys(value);
  return (
    keys.every((k) => isLocaleCode(k)) &&
    Object.values(value).every((v) => typeof v === 'string')
  );
};

export const resolveDeep = (value: unknown, locale: LocaleCode): unknown => {
  if (Array.isArray(value)) return value.map((v) => resolveDeep(v, locale));
  if (value && typeof value === 'object') {
    if (isLocalizedObject(value)) return resolveLocalized(value, locale);
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, resolveDeep(v, locale)]),
    );
  }
  return value;
};

const sectionPublic = (
  s: SectionBase,
  locale: LocaleCode,
): SectionPublicResponse => ({
  id: s.id,
  key: s.key,
  type: s.type,
  enabled: true,
  order: s.order,
  props: resolveDeep(s.props ?? {}, locale) as Record<string, unknown>,
});

export const pageModel2PagePublicReadResponse = (
  page: PageDocument,
  locale: LocaleCode,
): PagePublicReadResponse => ({
  key: page.key,
  seo: {
    title: resolveLocalized(page.seo.title, locale),
    description: resolveLocalized(page.seo.description, locale),
    ogImageUrl: page.seo.ogImageUrl || undefined,
  },
  sections: [...page.sections]
    .filter((s) => s.enabled)
    .sort(byOrder)
    .map((s) => sectionPublic(s, locale)),
});
