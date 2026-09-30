'use client';

import { Form, Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { getCatalogCategoryFormInitialValue } from '@/app/_service/catalog/form.initialValues';
import {
  useDeleteAdminCatalogCategoriesById,
  usePatchAdminCatalogCategoriesById,
  usePostAdminCatalogCategories,
} from '@/app/_service/catalog/hook.mutation';
import {
  ADMIN_CATALOG_CATEGORIES_LIST_QUERY_KEY,
  useGetAdminCatalogCategoriesList,
} from '@/app/_service/catalog/hook.query';
import type { CatalogCategoryFormSchema } from '@/app/_service/catalog/interface.form';
import type { CatalogCategorySchema } from '@/app/_service/catalog/interface.schema';
import { catalogCategoryValidationSchema } from '@/app/_service/catalog/validation';
import { applyApiValidationErrorsToFormik } from '@/lib/api/applyFormikValidationErrors';
import { notify } from '@/lib/notification/notificationService';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import RequirePermission from '../RequirePermission';
import LocalizedTextInput from '../fields/LocalizedTextInput';
import { useLocales } from '../LocalesContext';
import ConfirmDialog from '../ui/ConfirmDialog';
import Drawer from '../ui/Drawer';
import EmptyState from '../ui/EmptyState';
import { FormText } from '../ui/fields';
import PageHeader from '../ui/PageHeader';
import { useTypeOptions } from './useTypeOptions';

const FORM_ID = 'category-form';

const CategoriesScreen = () => {
  const t = useTranslations('admin');
  const { defaultLocale } = useLocales();
  const queryClient = useQueryClient();
  const { options: typeOptions, isLoading: typesLoading } = useTypeOptions();
  const [selectedTypeId, setTypeId] = useState('');
  // Derived: the first type until the user picks one.
  const typeId = selectedTypeId || typeOptions[0]?.value || '';
  const { data: categories, isLoading } = useGetAdminCatalogCategoriesList({
    typeId,
    options: { enabled: Boolean(typeId) },
  });
  const [drawer, setDrawer] = useState<{ open: boolean; category?: CatalogCategorySchema }>({
    open: false,
  });
  const [toDelete, setToDelete] = useState<CatalogCategorySchema | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [ADMIN_CATALOG_CATEGORIES_LIST_QUERY_KEY] });
  const close = () => setDrawer((d) => ({ ...d, open: false }));
  const create = usePostAdminCatalogCategories(() => {
    notify.success(t('common.saved'));
    invalidate();
    close();
  });
  const update = usePatchAdminCatalogCategoriesById(() => {
    notify.success(t('common.saved'));
    invalidate();
    close();
  });
  const remove = useDeleteAdminCatalogCategoriesById(() => {
    notify.success(t('common.deleted'));
    invalidate();
    setToDelete(null);
  });
  const saving = create.isPending || update.isPending;

  return (
    <RequirePermission permission="catalog.categories">
      <PageHeader
        title={t('catalog.categories.title')}
        subtitle={t('catalog.categories.subtitle')}
        actions={
          <>
            <select
              className="select select-sm"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              disabled={typesLoading}
              aria-label={t('catalog.items.type')}
            >
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!typeId}
              onClick={() => setDrawer({ open: true })}
            >
              <IconByName name="plus" className="size-4" />
              {t('catalog.categories.new')}
            </button>
          </>
        }
      />
      {isLoading || typesLoading ? (
        <Loading size="md" />
      ) : !categories?.length ? (
        <EmptyState icon="folder" title={t('catalog.categories.empty')} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4"
            >
              <span className="icon-tile size-10">
                <IconByName name="folder" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium">{c.name[defaultLocale] || c.slug}</p>
                <code className="text-caption text-ink-subtle" dir="ltr">
                  {c.slug}
                </code>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                aria-label={t('common.edit')}
                onClick={() => setDrawer({ open: true, category: c })}
              >
                <IconByName name="pencil" className="size-4" />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square text-danger"
                aria-label={t('common.delete')}
                onClick={() => setToDelete(c)}
              >
                <IconByName name="trash-2" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Drawer
        open={drawer.open}
        onClose={close}
        title={drawer.category ? t('catalog.categories.edit') : t('catalog.categories.new')}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={close} disabled={saving}>
              {t('common.cancel')}
            </button>
            <button type="submit" form={FORM_ID} className="btn btn-primary" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        <Formik<CatalogCategoryFormSchema>
          initialValues={getCatalogCategoryFormInitialValue(drawer.category, typeId)}
          validationSchema={catalogCategoryValidationSchema}
          enableReinitialize
          onSubmit={(values, { setFieldError }) => {
            const onError = (err: unknown) => applyApiValidationErrorsToFormik(setFieldError, err);
            if (drawer.category)
              update.mutate({ id: drawer.category.id, payload: values }, { onError });
            else create.mutate({ payload: values }, { onError });
          }}
        >
          <Form id={FORM_ID} noValidate className="flex flex-col gap-5">
            <LocalizedTextInput name="name" label={t('catalog.categories.name')} required />
            <FormText
              name="slug"
              label={t('catalog.types.slug')}
              hint={t('catalog.types.slugHint')}
              dir="ltr"
            />
          </Form>
        </Formik>
      </Drawer>
      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('catalog.categories.deleteTitle')}
        text={t('catalog.categories.deleteText')}
        confirmLabel={t('common.delete')}
        danger
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate({ id: toDelete.id })}
      />
    </RequirePermission>
  );
};

export default CategoriesScreen;
