'use client';

import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ADMIN_HOME_PATH, useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { usePostAuthLogin } from '@/app/_service/auth/hook.mutation';
import { getAuthLoginFormInitialValue } from '@/app/_service/auth/form.initialValues';
import { authLoginValidationSchema } from '@/app/_service/auth/validation';
import { isApiError } from '@/lib/api/errors';
import IconByName from '@/shared/UI/IconByName';
import LocaleSwitcher from '@/shared/layout/public/LocaleSwitcher';
import ThemeToggle from '@/shared/layout/public/ThemeToggle';
import { SUPPORTED_LOCALES } from '@/i18n/routing';
import { FormText } from './ui/fields';

const LoginForm = () => {
  const t = useTranslations('admin.login');
  const router = useRouter();
  const { login, isAuthenticated, initializing } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initializing && isAuthenticated) router.replace(ADMIN_HOME_PATH);
  }, [initializing, isAuthenticated, router]);

  const { mutate, isPending } = usePostAuthLogin((tokens) => {
    login(tokens.accessToken, tokens.refreshToken);
    router.replace(ADMIN_HOME_PATH);
  });

  return (
    <div className="w-full max-w-md rounded-xl border border-line bg-surface p-8 shadow-lg">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span className="icon-tile mb-4 size-11">
            <IconByName name="lock" className="size-5" />
          </span>
          <h1 className="text-h3">{t('title')}</h1>
          <p className="mt-1 text-small text-ink-muted">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher locales={[...SUPPORTED_LOCALES]} />
          <ThemeToggle />
        </div>
      </div>
      <Formik
        initialValues={getAuthLoginFormInitialValue()}
        validationSchema={authLoginValidationSchema}
        onSubmit={(values) => {
          setError(null);
          mutate(
            { payload: values },
            {
              onError: (err) => {
                if (isApiError(err) && err.code === 'INVALID_CREDENTIALS') setError(t('invalid'));
                else if (isApiError(err) && err.code === 'RATE_LIMITED') setError(t('rateLimited'));
                else setError(t('failed'));
              },
            }
          );
        }}
      >
        <Form noValidate className="flex flex-col gap-4">
          <FormText
            name="email"
            type="email"
            label={t('email')}
            autoComplete="username"
            dir="ltr"
            required
          />
          <FormText
            name="password"
            type="password"
            label={t('password')}
            autoComplete="current-password"
            dir="ltr"
            required
          />
          {error && (
            <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-small text-danger">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary mt-2 w-full" disabled={isPending}>
            {isPending && <span className="loading loading-spinner loading-xs" />}
            {isPending ? t('submitting') : t('submit')}
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
