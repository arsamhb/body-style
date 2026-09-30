import { mapToObject, resolveLocalized } from '../../core/i18n/localized';
import { LocaleCode } from '../../core/i18n/types';
import { CatalogCategoryDocument } from './catalogCategory.model';
import { CatalogItemDocument } from './catalogItem.model';
import { CatalogTypeDocument } from './catalogType.model';
import { SpecDefinition, SpecValue } from './catalog.types';
import {
  CatalogCategoryAdminResponse,
  CatalogItemAdminResponse,
  CatalogItemCardResponse,
  CatalogItemPublicResponse,
  CatalogTypeAdminResponse,
  CatalogTypePublicResponse,
  CatalogTypePublicSummary,
  PublicCatalogCategory,
  PublicFilterDefinition,
  PublicSpec,
} from './interface.response';

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

const specDefinitionAdmin = (d: SpecDefinition): SpecDefinition => ({
  key: d.key,
  label: mapToObject(d.label),
  type: d.type,
  unit: mapToObject(d.unit),
  currency: d.currency ?? '',
  options: (d.options ?? []).map((o) => ({
    value: o.value,
    label: mapToObject(o.label),
  })),
  filterable: d.filterable,
  showOnCard: d.showOnCard,
  showOnDetail: d.showOnDetail,
  required: d.required,
  order: d.order,
});

export const catalogTypeModel2CatalogTypeAdminResponse = (
  type: CatalogTypeDocument,
  itemCount = 0,
): CatalogTypeAdminResponse => ({
  id: String(type._id),
  slug: type.slug,
  name: mapToObject(type.name),
  description: mapToObject(type.description),
  specDefinitions: [...type.specDefinitions]
    .sort(byOrder)
    .map(specDefinitionAdmin),
  cardDesign: {
    variant: type.cardDesign.variant,
    imageRatio: type.cardDesign.imageRatio,
    showSummary: type.cardDesign.showSummary,
    cardSpecKeys: [...type.cardDesign.cardSpecKeys],
    badgeSpecKey: type.cardDesign.badgeSpecKey,
    priceSpecKey: type.cardDesign.priceSpecKey,
  },
  filterConfig: {
    categoriesEnabled: type.filterConfig.categoriesEnabled,
    searchEnabled: type.filterConfig.searchEnabled,
    enabledFilterKeys: [...type.filterConfig.enabledFilterKeys],
    sortKeys: [...type.filterConfig.sortKeys],
  },
  seo: {
    title: mapToObject(type.seo.title),
    description: mapToObject(type.seo.description),
  },
  enabled: type.enabled,
  order: type.order,
  itemCount,
  createdAt: type.createdAt.toISOString(),
  updatedAt: type.updatedAt.toISOString(),
});

export const catalogCategoryModel2CatalogCategoryAdminResponse = (
  c: CatalogCategoryDocument,
): CatalogCategoryAdminResponse => ({
  id: String(c._id),
  typeId: String(c.typeId),
  slug: c.slug,
  name: mapToObject(c.name),
  order: c.order,
});

export const catalogItemModel2CatalogItemAdminResponse = (
  item: CatalogItemDocument,
): CatalogItemAdminResponse => ({
  id: String(item._id),
  typeId: String(item.typeId),
  slug: item.slug,
  title: mapToObject(item.title),
  summary: mapToObject(item.summary),
  description: mapToObject(item.description),
  coverImage: item.coverImage,
  images: [...item.images],
  categoryIds: item.categoryIds.map(String),
  specs: item.specs ?? {},
  featured: item.featured,
  order: item.order,
  status: item.status,
  seo: {
    title: mapToObject(item.seo.title),
    description: mapToObject(item.seo.description),
  },
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

/* ---------- public ---------- */

export const typeHref = (slug: string) => `/catalog/${slug}`;
export const itemHref = (typeSlug: string, itemSlug: string) =>
  `/catalog/${typeSlug}/${itemSlug}`;

const categoryPublic = (
  c: CatalogCategoryDocument,
  locale: LocaleCode,
): PublicCatalogCategory => ({
  id: String(c._id),
  slug: c.slug,
  name: resolveLocalized(c.name, locale),
});

const filterPublic = (
  d: SpecDefinition,
  locale: LocaleCode,
): PublicFilterDefinition => ({
  key: d.key,
  label: resolveLocalized(d.label, locale),
  type: d.type,
  unit: resolveLocalized(d.unit, locale),
  currency: d.currency ?? '',
  options: (d.options ?? []).map((o) => ({
    value: o.value,
    label: resolveLocalized(o.label, locale),
  })),
});

export const catalogTypeModel2CatalogTypePublicSummary = (
  type: CatalogTypeDocument,
  locale: LocaleCode,
  itemCount: number,
): CatalogTypePublicSummary => ({
  id: String(type._id),
  slug: type.slug,
  name: resolveLocalized(type.name, locale),
  description: resolveLocalized(type.description, locale),
  href: typeHref(type.slug),
  itemCount,
});

export const catalogTypeModel2CatalogTypePublicResponse = (
  type: CatalogTypeDocument,
  categories: CatalogCategoryDocument[],
  locale: LocaleCode,
  itemCount: number,
): CatalogTypePublicResponse => {
  const enabled = new Set(type.filterConfig.enabledFilterKeys);
  return {
    ...catalogTypeModel2CatalogTypePublicSummary(type, locale, itemCount),
    categories: [...categories]
      .sort(byOrder)
      .map((c) => categoryPublic(c, locale)),
    filters: [...type.specDefinitions]
      .sort(byOrder)
      .filter((d) => d.filterable && enabled.has(d.key))
      .map((d) => filterPublic(d, locale)),
    categoriesEnabled: type.filterConfig.categoriesEnabled,
    searchEnabled: type.filterConfig.searchEnabled,
    sortKeys: [...type.filterConfig.sortKeys],
    sortSpecs: type.specDefinitions
      .filter((d) => type.filterConfig.sortKeys.includes(d.key))
      .map((d) => filterPublic(d, locale)),
    cardDesign: {
      variant: type.cardDesign.variant,
      imageRatio: type.cardDesign.imageRatio,
      showSummary: type.cardDesign.showSummary,
      cardSpecKeys: [...type.cardDesign.cardSpecKeys],
      badgeSpecKey: type.cardDesign.badgeSpecKey,
      priceSpecKey: type.cardDesign.priceSpecKey,
    },
    seo: {
      title: resolveLocalized(type.seo.title, locale),
      description: resolveLocalized(type.seo.description, locale),
    },
  };
};

const specPublic = (
  def: SpecDefinition,
  value: SpecValue,
  locale: LocaleCode,
): PublicSpec => {
  const labelOf = (v: string) => {
    const opt = def.options.find((o) => o.value === v);
    return opt ? resolveLocalized(opt.label, locale) : v;
  };
  let valueLabel: string | undefined;
  if (def.type === 'select' && typeof value === 'string')
    valueLabel = labelOf(value);
  if (def.type === 'multiselect' && Array.isArray(value))
    valueLabel = value.map(labelOf).join('، ');
  return {
    key: def.key,
    label: resolveLocalized(def.label, locale),
    type: def.type,
    unit: resolveLocalized(def.unit, locale),
    currency: def.currency ?? '',
    value,
    ...(valueLabel !== undefined ? { valueLabel } : {}),
  };
};

const resolveSpec = (
  type: CatalogTypeDocument,
  item: CatalogItemDocument,
  key: string,
  locale: LocaleCode,
): PublicSpec | undefined => {
  if (!key) return undefined;
  const def = type.specDefinitions.find((d) => d.key === key);
  const value = item.specs?.[key];
  if (!def || value === undefined || value === null || value === '')
    return undefined;
  return specPublic(def, value, locale);
};

export const catalogItemModel2CatalogItemCardResponse = (
  item: CatalogItemDocument,
  type: CatalogTypeDocument,
  categories: CatalogCategoryDocument[],
  locale: LocaleCode,
): CatalogItemCardResponse => {
  const ids = new Set(item.categoryIds.map(String));
  return {
    id: String(item._id),
    slug: item.slug,
    href: itemHref(type.slug, item.slug),
    title: resolveLocalized(item.title, locale),
    summary: resolveLocalized(item.summary, locale),
    coverImage: item.coverImage || item.images[0] || undefined,
    featured: item.featured,
    categories: categories
      .filter((c) => ids.has(String(c._id)))
      .map((c) => categoryPublic(c, locale)),
    badge: resolveSpec(type, item, type.cardDesign.badgeSpecKey, locale),
    price: resolveSpec(type, item, type.cardDesign.priceSpecKey, locale),
    cardSpecs: type.cardDesign.cardSpecKeys
      .map((key) => resolveSpec(type, item, key, locale))
      .filter((s): s is PublicSpec => Boolean(s)),
  };
};

export const catalogItemModel2CatalogItemPublicResponse = (
  item: CatalogItemDocument,
  type: CatalogTypeDocument,
  categories: CatalogCategoryDocument[],
  locale: LocaleCode,
): CatalogItemPublicResponse => ({
  ...catalogItemModel2CatalogItemCardResponse(item, type, categories, locale),
  description: resolveLocalized(item.description, locale),
  images: item.images.length
    ? [...item.images]
    : item.coverImage
      ? [item.coverImage]
      : [],
  specs: [...type.specDefinitions]
    .sort(byOrder)
    .filter((d) => d.showOnDetail)
    .map((d) => resolveSpec(type, item, d.key, locale))
    .filter((s): s is PublicSpec => Boolean(s)),
  seo: {
    title:
      resolveLocalized(item.seo.title, locale) ||
      resolveLocalized(item.title, locale),
    description:
      resolveLocalized(item.seo.description, locale) ||
      resolveLocalized(item.summary, locale),
  },
  type: {
    slug: type.slug,
    name: resolveLocalized(type.name, locale),
    href: typeHref(type.slug),
  },
});
