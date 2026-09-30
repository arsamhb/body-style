'use client';

import { Form, Formik, useFormikContext } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import type { LocaleCode } from '@/i18n/routing';
import { getCatalogItemFormInitialValue } from '@/app/_service/catalog/form.initialValues';
import {
  usePatchAdminCatalogItemsById,
  usePostAdminCatalogItems,
} from '@/app/_service/catalog/hook.mutation';
import {
  ADMIN_CATALOG_ITEMS_LIST_QUERY_KEY,
  useGetAdminCatalogCategoriesList,
  useGetAdminCatalogItemsById,
} from '@/app/_service/catalog/hook.query';
import type { CatalogItemFormSchema } from '@/app/_service/catalog/interface.form';
import { catalogItemValidationSchema } from '@/app/_service/catalog/validation';
import { applyApiValidationErrorsToFormik } from '@/lib/api/applyFormikValidationErrors';
import { notify } from '@/lib/notification/notificationService';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import RequirePermission from '../RequirePermission';
import ImageField from '../fields/ImageField';
import LocalizedTextInput from '../fields/LocalizedTextInput';
import SortableList from '../fields/SortableList';
import { useLocales } from '../LocalesContext';
import { FormSelect, FormText, FormToggle } from '../ui/fields';
import PageHeader from '../ui/PageHeader';
import DynamicSpecField from './DynamicSpecField';
import { useTypeOptions } from './useTypeOptions';

const FORM_ID = 'catalog-item-form';

const Fields = ({ isNew }: { isNew: boolean }) => {
  const t = useTranslations('admin.catalog');
  const { defaultLocale } = useLocales();
  const locale = useLocale() as LocaleCode;
  const { values, setFieldValue } = useFormikContext<CatalogItemFormSchema>();
  const { types, options: typeOptions } = useTypeOptions();
  const type = types.find((x) => x.id === values.typeId);
  const { data: categories } = useGetAdminCatalogCategoriesList({
    typeId: values.typeId,
    options: { enabled: Boolean(values.typeId) },
  });

  useEffect(() => {
    if (isNew && !values.typeId && typeOptions[0]) setFieldValue('typeId', typeOptions[0].value);
  }, [isNew, values.typeId, typeOptions, setFieldValue]);

  const toggleCategory = (id: string) => {
    const next = new Set(values.categoryIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFieldValue('categoryIds', [...next]);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-5">
        {isNew && (
          <FormSelect name="typeId" label={t('items.type')} options={typeOptions} required />
        )}
        <LocalizedTextInput name="title" label={t('items.itemTitle')} required />
        <FormText name="slug" label={t('types.slug')} hint={t('items.slugHint')} dir="ltr" />
        <LocalizedTextInput name="summary" label={t('items.summary')} multiline rows={2} />
        <LocalizedTextInput name="description" label={t('items.description')} multiline rows={8} />
        <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5">
          <h2 className="text-h4">{t('items.specs')}</h2>
          {!type || type.specDefinitions.length === 0 ? (
            <p className="text-small text-ink-muted">{t('items.noSpecs')}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {[...type.specDefinitions]
                .sort((a, b) => a.order - b.order)
                .map((def) => (
                  <DynamicSpecField key={def.key} def={def} locale={locale} />
                ))}
            </div>
          )}
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-h4">{t('items.seo')}</h2>
          <LocalizedTextInput name="seo.title" label={t('items.seoTitle')} />
          <LocalizedTextInput
            name="seo.description"
            label={t('items.seoDescription')}
            multiline
            rows={2}
          />
        </section>
      </div>
      <aside className="flex flex-col gap-5">
        <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5">
          <FormSelect
            name="status"
            label={t('items.status')}
            options={[
              { value: 'draft', label: t('items.draft') },
              { value: 'published', label: t('items.published') },
            ]}
          />
          <FormToggle name="featured" label={t('items.featured')} hint={t('items.featuredHint')} />
        </section>
        <section className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5">
          <ImageField name="coverImage" label={t('items.coverImage')} aspect="aspect-[4/3]" />
          <div className="flex flex-col gap-2">
            <span className="text-small font-medium">{t('items.gallery')}</span>
            <SortableList<string>
              name="images"
              items={values.images}
              newItem={() => ''}
              itemTitle={(src) => src.split('/').pop() ?? ''}
              max={12}
              addLabel={t('items.addImage')}
              renderItem={(i) => (
                <ImageField name={`images.${i}`} label={t('items.image')} aspect="aspect-[4/3]" />
              )}
            />
          </div>
        </section>
        <section className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5">
          <span className="text-small font-medium">{t('categories.title')}</span>
          {!categories?.length ? (
            <p className="text-caption text-ink-subtle">{t('categories.empty')}</p>
          ) : (
            <ul className="flex flex-col gap-2" role="list">
              {categories.map((c) => (
                <li key={c.id}>
                  <label className="flex cursor-pointer items-center gap-2 text-small">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={values.categoryIds.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                    />
                    {c.name[defaultLocale] || c.slug}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
};

const ItemEditorScreen = ({ id }: { id: string }) => {
  const t = useTranslations('admin');
  const isNew = id === 'new';
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { types } = useTypeOptions();
  const { data: item, isLoading } = useGetAdminCatalogItemsById({
    id,
    options: { enabled: !isNew },
  });
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [ADMIN_CATALOG_ITEMS_LIST_QUERY_KEY] });
  const create = usePostAdminCatalogItems((created) => {
    notify.success(t('common.saved'));
    invalidate();
    router.replace(`/admin/catalog/items/${created.id}`);
  });
  const update = usePatchAdminCatalogItemsById((updated) => {
    notify.success(t('common.saved'));
    invalidate();
    queryClient.setQueryData(['get-admin-catalog-items-by-id', id], updated);
  });
  const pending = create.isPending || update.isPending;

  if (!isNew && (isLoading || !item)) return <Loading size="md" />;

  return (
    <RequirePermission permission="catalog.items">
      <PageHeader
        title={isNew ? t('catalog.items.new') : t('catalog.items.edit')}
        actions={
          <>
            <Link href="/admin/catalog/items" className="btn btn-ghost btn-sm">
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
      <Formik<CatalogItemFormSchema>
        initialValues={getCatalogItemFormInitialValue(item, searchParams.get('typeId') ?? '')}
        validationSchema={catalogItemValidationSchema}
        enableReinitialize
        onSubmit={(values, { setFieldError }) => {
          const defs = types.find((x) => x.id === values.typeId)?.specDefinitions ?? [];
          const onError = (err: unknown) => applyApiValidationErrorsToFormik(setFieldError, err);
          if (isNew) create.mutate({ payload: values, defs }, { onError });
          else update.mutate({ id, payload: values, defs }, { onError });
        }}
      >
        <Form id={FORM_ID} noValidate className="flex flex-col gap-6">
          <Fields isNew={isNew} />
        </Form>
      </Formik>
    </RequirePermission>
  );
};

export default ItemEditorScreen;
