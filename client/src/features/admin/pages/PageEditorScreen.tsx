'use client';

import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { getPageSeoFormInitialValue } from '@/app/_service/pages/form.initialValues';
import {
  useDeleteAdminPagesSectionsByKeyBySectionId,
  usePatchAdminPagesByKey,
  usePatchAdminPagesEnabledByKey,
  usePatchAdminPagesSectionsByKeyBySectionId,
  usePatchAdminPagesSectionsPropsByKeyBySectionId,
  usePatchAdminPagesSectionsReorderByKey,
  usePostAdminPagesSectionsByKey,
} from '@/app/_service/pages/hook.mutation';
import {
  ADMIN_PAGES_LIST_QUERY_KEY,
  adminPagesByKeyQueryKey,
  useGetAdminPagesByKey,
} from '@/app/_service/pages/hook.query';
import type { PageSchema } from '@/app/_service/pages/interface.schema';
import { pageSeoValidationSchema } from '@/app/_service/pages/validation';
import { SECTION_ICON, SECTION_PREVIEW_FIELD } from '@/features/sections/fieldSpecs';
import SectionPropsForm from '@/features/sections/admin/SectionPropsForm';
import type { AdminSection, SectionType } from '@/features/sections/types';
import { applyApiValidationErrorsToFormik } from '@/lib/api/applyFormikValidationErrors';
import type { PermissionKey } from '@/lib/auth/permissions';
import type { LocalizedString } from '@/lib/i18n/types';
import { notify } from '@/lib/notification/notificationService';
import type { PageKey } from '@/features/site/types';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import Can from '../Can';
import RequirePermission from '../RequirePermission';
import ImageField from '../fields/ImageField';
import LocalizedTextInput from '../fields/LocalizedTextInput';
import { useLocales } from '../LocalesContext';
import ConfirmDialog from '../ui/ConfirmDialog';
import Drawer from '../ui/Drawer';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import StatusBadge from '../ui/StatusBadge';

const SECTION_FORM_ID = 'section-props-form';
const SEO_FORM_ID = 'page-seo-form';

const previewText = (section: AdminSection, locale: string): string => {
  const path = SECTION_PREVIEW_FIELD[section.type];
  if (!path) return '';
  const value = path
    .split('.')
    .reduce<unknown>(
      (acc, k) =>
        acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined,
      section.props
    );
  return value && typeof value === 'object'
    ? ((value as LocalizedString)[locale as 'fa'] ?? '')
    : '';
};

const PageEditorScreen = ({ pageKey }: { pageKey: PageKey }) => {
  const t = useTranslations('admin');
  const queryClient = useQueryClient();
  const { defaultLocale } = useLocales();
  const { data: page, isLoading } = useGetAdminPagesByKey({ key: pageKey });
  const [editing, setEditing] = useState<AdminSection | null>(null);
  const [seoOpen, setSeoOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<AdminSection | null>(null);

  const sync = (data: PageSchema) => {
    queryClient.setQueryData(adminPagesByKeyQueryKey(pageKey), data);
    queryClient.invalidateQueries({ queryKey: ADMIN_PAGES_LIST_QUERY_KEY });
  };
  const saved = (data: PageSchema) => {
    sync(data);
    notify.success(t('common.saved'));
  };

  const toggleSection = usePatchAdminPagesSectionsByKeyBySectionId(sync);
  const saveProps = usePatchAdminPagesSectionsPropsByKeyBySectionId((data) => {
    saved(data);
    setEditing(null);
  });
  const reorder = usePatchAdminPagesSectionsReorderByKey(sync);
  const addSection = usePostAdminPagesSectionsByKey((data) => {
    sync(data);
    setAdding(false);
    const created = data.sections.find((s) => s.id === data.createdSectionId);
    if (created) setEditing(created);
  });
  const removeSection = useDeleteAdminPagesSectionsByKeyBySectionId((data) => {
    saved(data);
    setToDelete(null);
  });
  const togglePage = usePatchAdminPagesEnabledByKey(sync);
  const saveSeo = usePatchAdminPagesByKey((data) => {
    saved(data);
    setSeoOpen(false);
  });

  if (isLoading || !page) return <Loading size="md" />;

  const sections = [...page.sections].sort((a, b) => a.order - b.order);
  const move = (index: number, dir: -1 | 1) => {
    const ids = sections.map((s) => s.id);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorder.mutate({ key: pageKey, payload: { orderedIds: ids } });
  };

  return (
    <RequirePermission permission={`pages.${pageKey}` as PermissionKey}>
      <PageHeader
        title={t(`pages.keys.${pageKey}`)}
        subtitle={t('pages.editorSubtitle')}
        actions={
          <>
            <Link href="/admin/pages" className="btn btn-ghost btn-sm">
              <IconByName name="arrow-left" className="size-4 rtl:-scale-x-100" />
              {t('common.back')}
            </Link>
            <button type="button" className="btn btn-sm" onClick={() => setSeoOpen(true)}>
              <IconByName name="search" className="size-4" />
              {t('pages.seo')}
            </button>
            <Can developerOnly>
              <label className="flex items-center gap-2 text-small">
                {t('pages.enabled')}
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={page.enabled}
                  disabled={togglePage.isPending}
                  onChange={(e) =>
                    togglePage.mutate({ key: pageKey, payload: { enabled: e.target.checked } })
                  }
                />
              </label>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setAdding(true)}
              >
                <IconByName name="plus" className="size-4" />
                {t('pages.addSection')}
              </button>
            </Can>
          </>
        }
      />

      {sections.length === 0 ? (
        <EmptyState icon="layout-grid" title={t('pages.noSections')} />
      ) : (
        <ol className="flex flex-col gap-3" role="list">
          {sections.map((section, index) => (
            <li
              key={section.id}
              className={clsx(
                'flex flex-col gap-3 rounded-lg border bg-surface p-4 sm:flex-row sm:items-center',
                section.enabled ? 'border-line' : 'border-dashed border-line-strong opacity-70'
              )}
            >
              <span className="icon-tile shrink-0">
                <IconByName name={SECTION_ICON[section.type]} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-body font-medium">
                    {t(`sections.types.${section.type}`)}
                  </span>
                  <StatusBadge tone={section.enabled ? 'success' : 'neutral'}>
                    {section.enabled ? t('pages.visible') : t('pages.hidden')}
                  </StatusBadge>
                  <code className="text-caption text-ink-subtle" dir="ltr">
                    #{section.key}
                  </code>
                </div>
                <p className="truncate text-small text-ink-muted">
                  {previewText(section, defaultLocale) || '—'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-square"
                  aria-label={t('fields.moveUp')}
                  disabled={index === 0 || reorder.isPending}
                  onClick={() => move(index, -1)}
                >
                  <IconByName name="arrow-up" className="size-4" />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-square"
                  aria-label={t('fields.moveDown')}
                  disabled={index === sections.length - 1 || reorder.isPending}
                  onClick={() => move(index, 1)}
                >
                  <IconByName name="arrow-down" className="size-4" />
                </button>
                <button
                  type="button"
                  className={clsx('btn btn-sm', section.enabled ? 'btn-outline' : 'btn-primary')}
                  disabled={toggleSection.isPending}
                  onClick={() =>
                    toggleSection.mutate({
                      key: pageKey,
                      sectionId: section.id,
                      payload: { enabled: !section.enabled },
                    })
                  }
                >
                  <IconByName name={section.enabled ? 'eye-off' : 'eye'} className="size-4" />
                  {section.enabled ? t('pages.disable') : t('pages.enable')}
                </button>
                <button type="button" className="btn btn-sm" onClick={() => setEditing(section)}>
                  <IconByName name="pencil" className="size-4" />
                  {t('common.edit')}
                </button>
                <Can developerOnly>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square text-danger"
                    aria-label={t('common.delete')}
                    onClick={() => setToDelete(section)}
                  >
                    <IconByName name="trash-2" className="size-4" />
                  </button>
                </Can>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* Section editor */}
      <Drawer
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? t(`sections.types.${editing.type}`) : ''}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setEditing(null)}
              disabled={saveProps.isPending}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              form={SECTION_FORM_ID}
              className="btn btn-primary"
              disabled={saveProps.isPending}
            >
              {saveProps.isPending && <span className="loading loading-spinner loading-xs" />}
              {saveProps.isPending ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        {editing && (
          <SectionPropsForm
            formId={SECTION_FORM_ID}
            section={editing}
            onSubmit={(props, { onError }) =>
              saveProps.mutate({ key: pageKey, sectionId: editing.id, payload: props }, { onError })
            }
          />
        )}
      </Drawer>

      {/* Add section picker */}
      <Drawer open={adding} onClose={() => setAdding(false)} title={t('pages.addSection')}>
        <ul className="grid gap-2 sm:grid-cols-2" role="list">
          {page.allowedSectionTypes.map((type: SectionType) => (
            <li key={type}>
              <button
                type="button"
                disabled={addSection.isPending}
                onClick={() => addSection.mutate({ key: pageKey, payload: { type } })}
                className="flex w-full items-center gap-3 rounded-lg border border-line bg-surface p-3 text-start card-hover"
              >
                <span className="icon-tile size-10">
                  <IconByName name={SECTION_ICON[type]} className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-small font-medium">{t(`sections.types.${type}`)}</span>
                  <span className="text-caption text-ink-subtle">
                    {t(`sections.descriptions.${type}`)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Drawer>

      {/* SEO */}
      <Drawer
        open={seoOpen}
        onClose={() => setSeoOpen(false)}
        title={t('pages.seo')}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setSeoOpen(false)}>
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              form={SEO_FORM_ID}
              className="btn btn-primary"
              disabled={saveSeo.isPending}
            >
              {saveSeo.isPending ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        <Formik
          initialValues={getPageSeoFormInitialValue(page)}
          validationSchema={pageSeoValidationSchema}
          enableReinitialize
          onSubmit={(values, { setFieldError }) =>
            saveSeo.mutate(
              { key: pageKey, payload: values },
              { onError: (err) => applyApiValidationErrorsToFormik(setFieldError, err) }
            )
          }
        >
          <Form id={SEO_FORM_ID} noValidate className="flex flex-col gap-5">
            <LocalizedTextInput
              name="title"
              label={t('pages.seoTitle')}
              hint={t('pages.seoTitleHint')}
            />
            <LocalizedTextInput
              name="description"
              label={t('pages.seoDescription')}
              multiline
              rows={3}
            />
            <ImageField
              name="ogImageUrl"
              label={t('settings.seo.ogImage')}
              aspect="aspect-[1.91/1]"
            />
          </Form>
        </Formik>
      </Drawer>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={t('pages.deleteSectionTitle')}
        text={t('pages.deleteSectionText')}
        confirmLabel={t('common.delete')}
        danger
        loading={removeSection.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && removeSection.mutate({ key: pageKey, sectionId: toDelete.id })}
      />
    </RequirePermission>
  );
};

export default PageEditorScreen;
