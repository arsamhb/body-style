'use client';

import { Form, Formik, type FormikHelpers, type FormikValues } from 'formik';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import type * as Yup from 'yup';
import { ADMIN_SETTINGS_QUERY_KEY, useGetAdminSettings } from '@/app/_service/settings/hook.query';
import type { SettingsSchema } from '@/app/_service/settings/interface.schema';
import { applyApiValidationErrorsToFormik } from '@/lib/api/applyFormikValidationErrors';
import { notify } from '@/lib/notification/notificationService';
import Loading from '@/shared/UI/Loading';

interface SettingsFormProps<T extends FormikValues> {
  initialValues: (settings: SettingsSchema) => T;
  validationSchema: Yup.AnySchema;
  mutation: {
    mutate: (vars: { payload: T }, opts: { onError: (err: unknown) => void }) => void;
    isPending: boolean;
  };
  children: React.ReactNode | ((settings: SettingsSchema) => React.ReactNode);
}

/** Shared shell for the settings tabs: loads settings, submits one section, shows a save bar. */
export const useSettingsSaved = () => {
  const t = useTranslations('admin.common');
  const queryClient = useQueryClient();
  return (data: SettingsSchema) => {
    queryClient.setQueryData(ADMIN_SETTINGS_QUERY_KEY, data);
    notify.success(t('saved'));
  };
};

function SettingsForm<T extends FormikValues>({
  initialValues,
  validationSchema,
  mutation,
  children,
}: SettingsFormProps<T>) {
  const t = useTranslations('admin.common');
  const { data: settings, isLoading } = useGetAdminSettings();
  if (isLoading || !settings) return <Loading size="md" />;
  return (
    <Formik<T>
      initialValues={initialValues(settings)}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values, helpers: FormikHelpers<T>) =>
        mutation.mutate(
          { payload: values },
          { onError: (err) => applyApiValidationErrorsToFormik(helpers.setFieldError, err) }
        )
      }
    >
      {({ dirty }) => (
        <Form noValidate className="flex flex-col gap-6 pb-24">
          {typeof children === 'function' ? children(settings) : children}
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas/90 px-4 py-3 backdrop-blur lg:start-64">
            <div className="mx-auto flex max-w-4xl items-center justify-end gap-2">
              {dirty && <span className="me-auto text-caption text-warning">●</span>}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={mutation.isPending || !dirty}
              >
                {mutation.isPending && <span className="loading loading-spinner loading-xs" />}
                {mutation.isPending ? t('saving') : t('save')}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SettingsForm;
