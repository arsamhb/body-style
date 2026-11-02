'use client';

import clsx from 'clsx';
import { Form, Formik, useField } from 'formik';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { usePostPublicTickets } from '@/app/_service/tickets/hook.mutation';
import { useGetPublicTicketsToken } from '@/app/_service/tickets/hook.query';
import { ticketFormSchema2PublicTicketsCreatePayload } from '@/app/_service/tickets/adapter.localToApi';
import { getTicketFormInitialValue } from '@/app/_service/tickets/form.initialValues';
import type { TicketFormSchema, TicketSource } from '@/app/_service/tickets/interface.form';
import { ticketCreateValidationSchema } from '@/app/_service/tickets/validation';
import { isApiError } from '@/lib/api/errors';
import IconByName from '@/shared/UI/IconByName';
import { ctaClassName } from '@/shared/UI/Cta';

export type { TicketSource };

interface TicketFormProps {
  source: TicketSource;
  compact?: boolean;
  className?: string;
}

const TOKEN_ERRORS = new Set(['TOKEN_INVALID', 'TOKEN_TOO_EARLY', 'TOKEN_EXPIRED', 'TOKEN_USED']);

const inputClass =
  'w-full rounded-xs border border-line-strong bg-canvas-subtle px-4 py-3 text-body text-ink placeholder:text-ink-subtle transition-[border-color,box-shadow,background-color] duration-fast hover:border-ink-subtle focus:border-brand focus:bg-surface focus:outline-none focus:shadow-glow aria-[invalid=true]:border-danger';

const Field = ({
  name,
  label,
  placeholder,
  type = 'text',
  as = 'input',
  rows,
  required,
  inputMode,
}: {
  name: keyof TicketFormSchema;
  label: string;
  placeholder: string;
  type?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  required?: boolean;
  inputMode?: 'tel' | 'text';
}) => {
  const t = useTranslations('ticket');
  const [field, meta] = useField<string>(name);
  const invalid = Boolean(meta.touched && meta.error);
  const id = `ticket-${name}`;
  const Tag = as;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <Tag
        id={id}
        {...field}
        type={as === 'input' ? type : undefined}
        rows={rows}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={clsx(inputClass, as === 'textarea' && 'resize-y min-h-28')}
        dir={inputMode === 'tel' ? 'ltr' : undefined}
      />
      {invalid && (
        <p id={`${id}-error`} className="text-caption text-danger">
          {t.has(meta.error as never) ? t(meta.error as never) : meta.error}
        </p>
      )}
    </div>
  );
};

/**
 * Public request form. Every instance says where it lives (`source`) so the admin inbox can show
 * what prompted the request. Anti-abuse: a signed single-use token fetched on mount (bots that
 * post instantly fail the minimum age), a honeypot field, and server-side rate limits.
 */
const TicketForm = ({ source, compact, className }: TicketFormProps) => {
  const t = useTranslations('ticket');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { data: token, refetch: refetchToken } = useGetPublicTicketsToken();
  const retried = useRef(false);
  const submit = usePostPublicTickets(() => setStatus('success'));

  const send = async (values: TicketFormSchema): Promise<void> => {
    const fresh = token ?? (await refetchToken()).data;
    if (!fresh) {
      setStatus('error');
      return;
    }
    // Respect the token's minimum age so a fast human is not mistaken for a bot.
    const wait = fresh.issuedAt + fresh.minDelayMs - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    const payload = ticketFormSchema2PublicTicketsCreatePayload(values, {
      token: fresh.token,
      locale,
      source,
      path: typeof window !== 'undefined' ? window.location.pathname : '',
    });
    await new Promise<void>((resolve) => {
      submit.mutate(
        { payload },
        {
          onSuccess: () => resolve(),
          onError: async (err) => {
            // A stale/used token (e.g. the page sat open for an hour) gets one transparent retry.
            if (isApiError(err) && TOKEN_ERRORS.has(err.code) && !retried.current) {
              retried.current = true;
              const next = await refetchToken();
              if (next.data) {
                const delay = next.data.issuedAt + next.data.minDelayMs - Date.now();
                if (delay > 0) await new Promise((r) => setTimeout(r, delay));
                submit.mutate(
                  { payload: { ...payload, token: next.data.token } },
                  { onSuccess: () => resolve(), onError: () => (setStatus('error'), resolve()) }
                );
                return;
              }
            }
            setStatus('error');
            resolve();
          },
        }
      );
    });
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        className={clsx(
          'flex flex-col items-center gap-3 rounded-xs border border-line bg-surface p-8 text-center',
          className
        )}
      >
        <span className="icon-tile size-14 text-success bg-success-soft border-transparent">
          <IconByName name="circle-check" className="size-7" />
        </span>
        <h3 className="text-h4">{t('successTitle')}</h3>
        <p className="text-small text-ink-muted">{t('successText')}</p>
      </div>
    );
  }

  return (
    <Formik<TicketFormSchema>
      initialValues={getTicketFormInitialValue()}
      validationSchema={ticketCreateValidationSchema}
      onSubmit={async (values) => {
        setStatus('idle');
        await send(values);
      }}
    >
      {({ isSubmitting }) => (
        <Form
          noValidate
          className={clsx(
            'relative flex flex-col gap-5 rounded-xs border border-line bg-surface p-6 shadow-md before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-brand before:via-accent before:to-transparent',
            compact ? '' : 'lg:p-8',
            className
          )}
          data-source-page={source.page}
          data-source-section={source.section}
        >
          <div className={clsx('grid gap-4', !compact && 'sm:grid-cols-2')}>
            <Field name="name" label={t('name')} placeholder={t('namePlaceholder')} required />
            <Field
              name="phone"
              label={t('phone')}
              placeholder={t('phonePlaceholder')}
              type="tel"
              inputMode="tel"
              required
            />
          </div>
          <Field
            name="message"
            label={t('message')}
            placeholder={t('messagePlaceholder')}
            as="textarea"
            rows={compact ? 3 : 4}
          />
          {/* Honeypot: hidden from humans and screen readers, tempting for bots. */}
          <div
            aria-hidden="true"
            className="absolute -start-[9999px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor={`ticket-website-${source.section ?? source.page}`}>Website</label>
            <WebsiteField id={`ticket-website-${source.section ?? source.page}`} />
          </div>
          {status === 'error' && (
            <p role="alert" className="text-small text-danger">
              {t('errorText')}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-caption text-ink-subtle">{t('privacyNote')}</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(ctaClassName('primary', 'md'), 'disabled:opacity-60')}
            >
              {isSubmitting ? t('submitting') : t('submit')}
              <IconByName name="send" className="size-4 rtl:-scale-x-100" />
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const WebsiteField = ({ id }: { id: string }) => {
  const [field] = useField<string>('website');
  return <input id={id} {...field} type="text" tabIndex={-1} autoComplete="off" />;
};

export default TicketForm;
