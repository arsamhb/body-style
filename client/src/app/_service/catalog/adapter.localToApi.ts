import type { SpecDefinition, SpecValue, SpecValues } from '@/features/catalog/types';
import { cleanLocalized } from '../settings/adapter.localToApi';
import type {
  CatalogCategoryFormSchema,
  CatalogItemFormSchema,
  CatalogTypeFormSchema,
} from './interface.form';
import type {
  AdminCatalogCategoriesCreatePayload,
  AdminCatalogCategoriesUpdatePayload,
  AdminCatalogItemsWritePayload,
  AdminCatalogTypesWritePayload,
} from './interface.payload';

export const catalogTypeFormSchema2AdminCatalogTypesWritePayload = (
  form: CatalogTypeFormSchema
): AdminCatalogTypesWritePayload => ({
  ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
  name: cleanLocalized(form.name),
  description: cleanLocalized(form.description),
  specDefinitions: form.specDefinitions.map((d, index) => ({
    key: d.key.trim(),
    label: cleanLocalized(d.label),
    type: d.type,
    unit: cleanLocalized(d.unit),
    currency: d.currency ?? '',
    options:
      d.type === 'select' || d.type === 'multiselect'
        ? d.options.map((o) => ({ value: o.value.trim(), label: cleanLocalized(o.label) }))
        : [],
    filterable: d.filterable,
    showOnCard: d.showOnCard,
    showOnDetail: d.showOnDetail,
    required: d.required,
    order: index,
  })),
  cardDesign: form.cardDesign,
  filterConfig: form.filterConfig,
  seo: { title: cleanLocalized(form.seo.title), description: cleanLocalized(form.seo.description) },
  enabled: form.enabled,
});

export const catalogCategoryFormSchema2AdminCatalogCategoriesCreatePayload = (
  form: CatalogCategoryFormSchema
): AdminCatalogCategoriesCreatePayload => ({
  typeId: form.typeId,
  ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
  name: cleanLocalized(form.name),
});

export const catalogCategoryFormSchema2AdminCatalogCategoriesUpdatePayload = (
  form: CatalogCategoryFormSchema
): AdminCatalogCategoriesUpdatePayload => ({
  ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
  name: cleanLocalized(form.name),
});

/** Coerces raw form inputs into typed spec values using the type's definitions. Empty → omitted. */
export const coerceSpecs = (defs: SpecDefinition[], raw: Record<string, unknown>): SpecValues => {
  const out: SpecValues = {};
  for (const def of defs) {
    const v = raw[def.key];
    if (v === undefined || v === null || v === '') continue;
    let value: SpecValue | undefined;
    switch (def.type) {
      case 'number':
      case 'price': {
        const n = typeof v === 'number' ? v : Number(String(v).replace(/[,\s]/g, ''));
        if (Number.isFinite(n)) value = n;
        break;
      }
      case 'boolean':
        value = v === true || v === 'true';
        break;
      case 'multiselect':
        value = Array.isArray(v) ? v.map(String) : [String(v)];
        if ((value as string[]).length === 0) value = undefined;
        break;
      default:
        value = String(v);
    }
    if (value !== undefined) out[def.key] = value;
  }
  return out;
};

export const catalogItemFormSchema2AdminCatalogItemsWritePayload = (
  form: CatalogItemFormSchema,
  defs: SpecDefinition[],
  options?: { isCreate?: boolean }
): AdminCatalogItemsWritePayload => ({
  ...(options?.isCreate ? { typeId: form.typeId } : {}),
  ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
  title: cleanLocalized(form.title),
  summary: cleanLocalized(form.summary),
  description: cleanLocalized(form.description),
  coverImage: form.coverImage,
  images: form.images.filter(Boolean),
  categoryIds: form.categoryIds,
  specs: coerceSpecs(defs, form.specs),
  featured: form.featured,
  status: form.status,
  seo: { title: cleanLocalized(form.seo.title), description: cleanLocalized(form.seo.description) },
});
