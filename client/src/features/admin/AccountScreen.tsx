'use client';

import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { usePostAuthPassword } from '@/app/_service/auth/hook.mutation';
import { getAuthPasswordFormInitialValue } from '@/app/_service/auth/form.initialValues';
import { authPasswordValidationSchema } from '@/app/_service/auth/validation';
import { applyApiValidationErrorsToFormik } from '@/lib/api/applyFormikValidationErrors';
import { notify } from '@/lib/notification/notificationService';
import PageHeader from './ui/PageHeader';
import StatusBadge from './ui/StatusBadge';
import { FormText } from './ui/fields';

const AccountScreen = () => {
  const t = useTranslations('admin');
  const { me, logout } = useAuth();
  const changePassword = usePostAuthPassword(() => {
    notify.success(t('account.changed'));
    logout();
  });

  return (
    <>
      <PageHeader title={t('account.title')} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <section className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-6">
          <span className="text-caption text-ink-subtle">{t('users.email')}</span>
          <span className="text-body font-medium" dir="ltr">
            {me?.email}
          </span>
          <span className="mt-3 text-caption text-ink-subtle">{t('users.displayName')}</span>
          <span className="text-body">{me?.displayName || '—'}</span>
          <span className="mt-3 text-caption text-ink-subtle">{t('users.role')}</span>
          <span>
            {me && (
              <StatusBadge tone={me.role === 'developer' ? 'brand' : 'neutral'}>
                {t(`roles.${me.role}`)}
              </StatusBadge>
            )}
          </span>
        </section>
        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="text-h4">{t('account.passwordTitle')}</h2>
          <p className="mt-1 mb-5 text-small text-ink-muted">{t('account.passwordHint')}</p>
          <Formik
            initialValues={getAuthPasswordFormInitialValue()}
            validationSchema={authPasswordValidationSchema}
            onSubmit={(values, { setFieldError }) =>
              changePassword.mutate(
                { payload: values },
                { onError: (err) => applyApiValidationErrorsToFormik(setFieldError, err) }
              )
            }
          >
            <Form noValidate className="flex max-w-md flex-col gap-4">
              <FormText
                name="currentPassword"
                type="password"
                label={t('account.currentPassword')}
                autoComplete="current-password"
                dir="ltr"
                required
              />
              <FormText
                name="newPassword"
                type="password"
                label={t('account.newPassword')}
                autoComplete="new-password"
                dir="ltr"
                required
              />
              <FormText
                name="confirmPassword"
                type="password"
                label={t('account.confirmPassword')}
                autoComplete="new-password"
                dir="ltr"
                required
              />
              <button
                type="submit"
                className="btn btn-primary w-fit"
                disabled={changePassword.isPending}
              >
                {changePassword.isPending && (
                  <span className="loading loading-spinner loading-xs" />
                )}
                {t('common.save')}
              </button>
            </Form>
          </Formik>
        </section>
      </div>
    </>
  );
};

export default AccountScreen;
