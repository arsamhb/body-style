'use client';

import clsx from 'clsx';
import { Form, Formik, useFormikContext } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import type { LocaleCode } from '@/i18n/routing';
import {
  getCatalogTypeFormInitialValue,
  getSpecDefinitionInitialValue,
  getSpecOptionInitialValue,
} from '@/app/_service/catalog/form.initialValues';
import {
  usePatchAdminCatalogTypesById,
  usePostAdminCatalogTypes,
} from '@/app/_service/catalog/hook.mutation';
import {
  ADMIN_CATALOG_TYPES_LIST_QUERY_KEY,
  useGetAdminCatalogTypesById,
} from '@/app/_service/catalog/hook.query';
import type { CatalogTypeFormSchema } from '@/app/_service/catalog/interface.form';
import { catalogTypeValidationSchema } from '@/app/_service/catalog/validation';
import CatalogCard from '@/features/catalog/CatalogCard';
import {
  CARD_VARIANTS,
  IMAGE_RATIOS,
  SPEC_TYPES,
  type CatalogItemCard,
  type PublicSpec,
  type SpecDefinition,
  type SpecOption,
} from '@/features/catalog/types';
import { applyApiValidationErrorsToFormik } from '@/lib/api/applyFormikValidationErrors';
import { notify } from '@/lib/notification/notificationService';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import RequirePermission from '../RequirePermission';
import LocalizedTextInput from '../fields/LocalizedTextInput';
import SortableList from '../fields/SortableList';
import { useLocales } from '../LocalesContext';
import { FormSelect, FormText, FormToggle } from '../ui/fields';
import PageHeader from '../ui/PageHeader';

const FORM_ID = 'catalog-type-form';
const TABS = ['basics', 'specs', 'card', 'filters', 'seo'] as const;
type Tab = (typeof TABS)[number];

/* ---------- specs tab ---------- */
const SpecOptionsEditor = ({ name }: { name: string }) => {
  const t = useTranslations('admin.catalog.specs');
  const { values } = useFormikContext<CatalogTypeFormSchema>();
  const { defaultLocale } = useLocales();
  const options = (name
    .split('.')
    .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], values) ??
    []) as SpecOption[];
  return (
    <div className="flex flex-col gap-2 rounded-md border border-dashed border-line-strong p-3">
      <span className="text-small font-medium">{t('options')}</span>
      <SortableList<SpecOption>
        name={name}
        items={options}
        newItem={getSpecOptionInitialValue}
        itemTitle={(o) => o.label[defaultLocale] || o.value}
        max={50}
        renderItem={(i) => (
          <div className="grid gap-3 md:grid-cols-2">
            <FormText
              name={`${name}.${i}.value`}
              label={t('optionValue')}
              hint={t('optionValueHint')}
              dir="ltr"
              required
            />
            <LocalizedTextInput name={`${name}.${i}.label`} label={t('optionLabel')} required />
          </div>
        )}
      />
    </div>
  );
};

const SpecsTab = () => {
  const t = useTranslations('admin.catalog.specs');
  const { values } = useFormikContext<CatalogTypeFormSchema>();
  const { defaultLocale } = useLocales();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-ink-muted">{t('intro')}</p>
      <SortableList<SpecDefinition>
        name="specDefinitions"
        items={values.specDefinitions}
        newItem={getSpecDefinitionInitialValue}
        itemTitle={(d) => `${d.label[defaultLocale] || d.key || '…'}${d.key ? ` (${d.key})` : ''}`}
        max={40}
        addLabel={t('add')}
        renderItem={(i, def) => (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FormText
                name={`specDefinitions.${i}.key`}
                label={t('key')}
                hint={t('keyHint')}
                dir="ltr"
                placeholder="price"
                required
              />
              <LocalizedTextInput name={`specDefinitions.${i}.label`} label={t('label')} required />
              <FormSelect
                name={`specDefinitions.${i}.type`}
                label={t('type')}
                options={SPEC_TYPES.map((v) => ({ value: v, label: t(`types.${v}`) }))}
              />
            </div>
            {(def.type === 'number' || def.type === 'price') && (
              <div className="grid gap-4 md:grid-cols-2">
                {def.type === 'number' ? (
                  <LocalizedTextInput
                    name={`specDefinitions.${i}.unit`}
                    label={t('unit')}
                    placeholder="kg"
                  />
                ) : (
                  <FormText
                    name={`specDefinitions.${i}.currency`}
                    label={t('currency')}
                    placeholder="تومان"
                  />
                )}
              </div>
            )}
            {(def.type === 'select' || def.type === 'multiselect') && (
              <SpecOptionsEditor name={`specDefinitions.${i}.options`} />
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FormToggle name={`specDefinitions.${i}.required`} label={t('required')} />
              <FormToggle
                name={`specDefinitions.${i}.filterable`}
                label={t('filterable')}
                hint={t('filterableHint')}
              />
              <FormToggle name={`specDefinitions.${i}.showOnCard`} label={t('showOnCard')} />
              <FormToggle name={`specDefinitions.${i}.showOnDetail`} label={t('showOnDetail')} />
            </div>
          </div>
        )}
      />
    </div>
  );
};

/* ---------- card tab with live preview ---------- */
const KeyChecklist = ({
  name,
  keys,
  max,
  label,
  single,
}: {
  name: string;
  keys: SpecDefinition[];
  max?: number;
  label: string;
  single?: boolean;
}) => {
  const { values, setFieldValue } = useFormikContext<CatalogTypeFormSchema>();
  const { defaultLocale } = useLocales();
  const t = useTranslations('admin.catalog.card');
  const current = name
    .split('.')
    .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], values);
  const selected = new Set<string>(
    single ? (current ? [current as string] : []) : ((current as string[]) ?? [])
  );
  const toggle = (key: string) => {
    if (single) {
      setFieldValue(name, selected.has(key) ? '' : key);
      return;
    }
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else if (!max || next.size < max) next.add(key);
    setFieldValue(name, [...next]);
  };
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-small font-medium">
        {label}
        {max && <span className="ms-1 text-caption text-ink-subtle">({t('max', { max })})</span>}
      </legend>
      {keys.length === 0 ? (
        <p className="text-caption text-ink-subtle">{t('noSpecs')}</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5" role="list">
          {keys.map((d) => (
            <li key={d.key}>
              <button
                type="button"
                aria-pressed={selected.has(d.key)}
                onClick={() => toggle(d.key)}
                className={clsx(
                  'rounded-pill border px-3 py-1 text-caption font-medium',
                  selected.has(d.key)
                    ? 'border-brand bg-brand text-brand-ink'
                    : 'border-line bg-surface text-ink-muted hover:text-ink'
                )}
              >
                {d.label[defaultLocale] || d.key}
              </button>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

const mockSpec = (d: SpecDefinition, locale: LocaleCode): PublicSpec => {
  const label = d.label[locale] || d.key;
  const base = {
    key: d.key,
    label,
    type: d.type,
    unit: d.unit[locale] ?? '',
    currency: d.currency,
  };
  switch (d.type) {
    case 'price':
      return { ...base, value: 1250000 };
    case 'number':
      return { ...base, value: 42 };
    case 'boolean':
      return { ...base, value: true };
    case 'select':
      return {
        ...base,
        value: d.options[0]?.value ?? '',
        valueLabel: d.options[0]?.label[locale] ?? d.options[0]?.value ?? '—',
      };
    case 'multiselect':
      return {
        ...base,
        value: d.options.slice(0, 2).map((o) => o.value),
        valueLabel: d.options
          .slice(0, 2)
          .map((o) => o.label[locale] ?? o.value)
          .join('، '),
      };
    case 'url':
      return { ...base, value: 'https://example.com/datasheet.pdf' };
    default:
      return { ...base, value: 'Lorem ipsum' };
  }
};

const CardTab = () => {
  const t = useTranslations('admin.catalog.card');
  const tc = useTranslations('catalog');
  const locale = useLocale() as LocaleCode;
  const { values } = useFormikContext<CatalogTypeFormSchema>();
  const defs = values.specDefinitions.filter((d) => d.key);
  const byKey = (k: string) => defs.find((d) => d.key === k);
  const mockItem: CatalogItemCard = {
    id: 'preview',
    slug: 'preview',
    href: '#',
    title: t('previewTitle'),
    summary: t('previewSummary'),
    coverImage: '/img/placeholders/product-1.svg',
    featured: true,
    categories: [{ id: 'c', slug: 'c', name: t('previewCategory') }],
    badge: byKey(values.cardDesign.badgeSpecKey)
      ? mockSpec(byKey(values.cardDesign.badgeSpecKey)!, locale)
      : undefined,
    price: byKey(values.cardDesign.priceSpecKey)
      ? mockSpec(byKey(values.cardDesign.priceSpecKey)!, locale)
      : undefined,
    cardSpecs: values.cardDesign.cardSpecKeys
      .map(byKey)
      .filter((d): d is SpecDefinition => Boolean(d))
      .map((d) => mockSpec(d, locale)),
  };
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FormSelect
            name="cardDesign.variant"
            label={t('variant')}
            options={CARD_VARIANTS.map((v) => ({ value: v, label: t(`variants.${v}`) }))}
          />
          <FormSelect
            name="cardDesign.imageRatio"
            label={t('imageRatio')}
            options={IMAGE_RATIOS.map((v) => ({ value: v, label: v }))}
          />
        </div>
        <FormToggle name="cardDesign.showSummary" label={t('showSummary')} />
        <KeyChecklist
          name="cardDesign.cardSpecKeys"
          keys={defs}
          max={4}
          label={t('cardSpecKeys')}
        />
        <KeyChecklist
          name="cardDesign.badgeSpecKey"
          keys={defs.filter((d) => ['boolean', 'select', 'text'].includes(d.type))}
          label={t('badgeSpecKey')}
          single
        />
        <KeyChecklist
          name="cardDesign.priceSpecKey"
          keys={defs.filter((d) => d.type === 'price' || d.type === 'number')}
          label={t('priceSpecKey')}
          single
        />
      </div>
      <aside className="flex flex-col gap-3 lg:sticky lg:top-24">
        <span className="text-caption font-semibold uppercase tracking-[0.18em] text-ink-subtle">
          {t('preview')}
        </span>
        <div className="rounded-xl border border-line bg-canvas-subtle p-4">
          <CatalogCard
            item={mockItem}
            design={values.cardDesign}
            locale={locale}
            labels={{ yes: tc('yes'), no: tc('no') }}
            preview
            sizes="320px"
          />
        </div>
      </aside>
    </div>
  );
};

const FiltersTab = () => {
  const t = useTranslations('admin.catalog.filters');
  const { values } = useFormikContext<CatalogTypeFormSchema>();
  const filterable = values.specDefinitions.filter((d) => d.key && d.filterable);
  const sortable = values.specDefinitions.filter(
    (d) => d.key && (d.type === 'number' || d.type === 'price' || d.type === 'text')
  );
  return (
    <div className="flex flex-col gap-5">
      <FormToggle name="filterConfig.categoriesEnabled" label={t('categoriesEnabled')} />
      <FormToggle name="filterConfig.searchEnabled" label={t('searchEnabled')} />
      <KeyChecklist
        name="filterConfig.enabledFilterKeys"
        keys={filterable}
        label={t('enabledFilterKeys')}
      />
      <p className="text-caption text-ink-subtle">{t('enabledFilterKeysHint')}</p>
      <KeyChecklist name="filterConfig.sortKeys" keys={sortable} label={t('sortKeys')} />
    </div>
  );
};

const TypeEditorScreen = ({ id }: { id: string }) => {
  const t = useTranslations('admin');
  const isNew = id === 'new';
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('basics');
  const { data: type, isLoading } = useGetAdminCatalogTypesById({
    id,
    options: { enabled: !isNew },
  });
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_TYPES_LIST_QUERY_KEY });
  const create = usePostAdminCatalogTypes((created) => {
    notify.success(t('common.saved'));
    invalidate();
    router.replace(`/admin/catalog/types/${created.id}`);
  });
  const update = usePatchAdminCatalogTypesById((updated) => {
    notify.success(t('common.saved'));
    invalidate();
    queryClient.setQueryData(['get-admin-catalog-types-by-id', id], updated);
  });
  const pending = create.isPending || update.isPending;

  if (!isNew && (isLoading || !type)) return <Loading size="md" />;

  return (
    <RequirePermission developerOnly>
      <PageHeader
        title={isNew ? t('catalog.types.new') : t('catalog.types.edit')}
        subtitle={t('catalog.types.editorSubtitle')}
        actions={
          <>
            <Link href="/admin/catalog/types" className="btn btn-ghost btn-sm">
              <IconByName name="arrow-left" className="size-4 rtl:-scale-x-100" />
              {t('common.back')}
            </Link>
            <button
              type="submit"
              form={FORM_ID}
              className="btn btn-primary btn-sm"
              disabled={pending}
            >
              {pending && <span className="loading loading-spinner loading-xs" />}
              {pending ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      />
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-line">
        {TABS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={clsx(
              '-mb-px border-b-2 px-4 py-2.5 text-small font-medium',
              tab === key
                ? 'border-brand text-ink'
                : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            {t(`catalog.tabs.${key}`)}
          </button>
        ))}
      </div>
      <Formik<CatalogTypeFormSchema>
        initialValues={getCatalogTypeFormInitialValue(type)}
        validationSchema={catalogTypeValidationSchema}
        enableReinitialize
        onSubmit={(values, { setFieldError }) => {
          const onError = (err: unknown) => {
            if (applyApiValidationErrorsToFormik(setFieldError, err)) setTab('specs');
          };
          if (isNew) create.mutate({ payload: values }, { onError });
          else update.mutate({ id, payload: values }, { onError });
        }}
      >
        <Form id={FORM_ID} noValidate className="flex flex-col gap-6">
          <div className={tab === 'basics' ? 'flex flex-col gap-5' : 'hidden'}>
            <LocalizedTextInput name="name" label={t('catalog.types.name')} required />
            <FormText
              name="slug"
              label={t('catalog.types.slug')}
              hint={t('catalog.types.slugHint')}
              dir="ltr"
              placeholder="products"
            />
            <LocalizedTextInput
              name="description"
              label={t('catalog.types.description')}
              multiline
              rows={3}
            />
            <FormToggle
              name="enabled"
              label={t('catalog.types.enabled')}
              hint={t('catalog.types.enabledHint')}
            />
          </div>
          <div className={tab === 'specs' ? '' : 'hidden'}>
            <SpecsTab />
          </div>
          <div className={tab === 'card' ? '' : 'hidden'}>
            <CardTab />
          </div>
          <div className={tab === 'filters' ? '' : 'hidden'}>
            <FiltersTab />
          </div>
          <div className={tab === 'seo' ? 'flex flex-col gap-5' : 'hidden'}>
            <LocalizedTextInput name="seo.title" label={t('pages.seoTitle')} />
            <LocalizedTextInput
              name="seo.description"
              label={t('pages.seoDescription')}
              multiline
              rows={3}
            />
          </div>
        </Form>
      </Formik>
    </RequirePermission>
  );
};

export default TypeEditorScreen;
