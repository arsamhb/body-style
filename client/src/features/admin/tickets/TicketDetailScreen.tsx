'use client';

import { Form, Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import type { LocaleCode } from '@/i18n/routing';
import { getTicketTriageFormInitialValue } from '@/app/_service/tickets/form.initialValues';
import {
  useDeleteAdminTicketsById,
  usePatchAdminTicketsById,
} from '@/app/_service/tickets/hook.mutation';
import {
  ADMIN_DASHBOARD_QUERY_KEY,
  ADMIN_TICKETS_LIST_QUERY_KEY,
  useGetAdminTicketsById,
} from '@/app/_service/tickets/hook.query';
import type { TicketTriageFormSchema } from '@/app/_service/tickets/interface.form';
import { TICKET_STATUSES } from '@/app/_service/tickets/interface.response';
import { ticketTriageValidationSchema } from '@/app/_service/tickets/validation';
import { LOCALE_META } from '@/lib/i18n/locales';
import { notify } from '@/lib/notification/notificationService';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import Can, { useCan } from '../Can';
import RequirePermission from '../RequirePermission';
import ConfirmDialog from '../ui/ConfirmDialog';
import { FormSelect, FormTextArea } from '../ui/fields';
import PageHeader from '../ui/PageHeader';
import StatusBadge from '../ui/StatusBadge';
import { SourceBadge } from './TicketsScreen';
import { STATUS_TONE } from './ticketUi';

const TicketDetailScreen = ({ id }: { id: string }) => {
  const t = useTranslations('admin');
  const locale = useLocale() as LocaleCode;
  const router = useRouter();
  const queryClient = useQueryClient();
  const can = useCan();
  const { data: ticket, isLoading } = useGetAdminTicketsById({ id });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [ADMIN_TICKETS_LIST_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEY });
  };
  const save = usePatchAdminTicketsById((updated) => {
    notify.success(t('common.saved'));
    queryClient.setQueryData(['get-admin-tickets-by-id', id], updated);
    invalidate();
  });
  const remove = useDeleteAdminTicketsById(() => {
    notify.success(t('common.deleted'));
    invalidate();
    router.replace('/admin/tickets');
  });

  if (isLoading || !ticket) return <Loading size="md" />;
  const fmt = new Intl.DateTimeFormat(LOCALE_META[locale].bcp47, {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const canWrite = can({ permission: 'tickets.write' });

  return (
    <RequirePermission permission="tickets.read">
      <PageHeader
        title={ticket.name}
        subtitle={fmt.format(ticket.createdAt)}
        actions={
          <>
            <Link href="/admin/tickets" className="btn btn-ghost btn-sm">
              <IconByName name="arrow-left" className="size-4 rtl:-scale-x-100" />
              {t('common.back')}
            </Link>
            <Can permission="tickets.write">
              <button
                type="button"
                className="btn btn-ghost btn-sm text-danger"
                onClick={() => setConfirmDelete(true)}
              >
                <IconByName name="trash-2" className="size-4" />
                {t('common.delete')}
              </button>
            </Can>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="flex flex-col gap-5 rounded-lg border border-line bg-surface p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone={STATUS_TONE[ticket.status]}>
              {t(`tickets.status.${ticket.status}`)}
            </StatusBadge>
            <SourceBadge source={ticket.source} />
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-caption text-ink-subtle">{t('tickets.phone')}</dt>
              <dd>
                <a
                  href={`tel:${ticket.phone}`}
                  className="text-body font-medium link-underline"
                  dir="ltr"
                >
                  {ticket.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-caption text-ink-subtle">{t('tickets.language')}</dt>
              <dd className="text-body">{ticket.locale}</dd>
            </div>
            {ticket.source.path && (
              <div className="sm:col-span-2">
                <dt className="text-caption text-ink-subtle">{t('tickets.path')}</dt>
                <dd>
                  <a
                    href={ticket.source.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-small link-underline"
                    dir="ltr"
                  >
                    {ticket.source.path}
                    <IconByName name="external-link" className="size-3.5" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div>
            <h2 className="mb-2 text-caption text-ink-subtle">{t('tickets.message')}</h2>
            <p className="whitespace-pre-line rounded-md bg-surface-raised p-4 text-body">
              {ticket.message || '—'}
            </p>
          </div>
          <p className="text-caption text-ink-subtle" dir="ltr">
            {ticket.userAgent}
          </p>
        </section>
        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="text-h4">{t('tickets.triage')}</h2>
          <Formik<TicketTriageFormSchema>
            initialValues={getTicketTriageFormInitialValue(ticket)}
            validationSchema={ticketTriageValidationSchema}
            enableReinitialize
            onSubmit={(values) => save.mutate({ id, payload: values })}
          >
            <Form noValidate className="mt-4 flex flex-col gap-4">
              <FormSelect
                name="status"
                label={t('tickets.status.label')}
                options={TICKET_STATUSES.map((s) => ({
                  value: s,
                  label: t(`tickets.status.${s}`),
                }))}
                disabled={!canWrite}
              />
              <FormTextArea
                name="adminNote"
                label={t('tickets.note')}
                hint={t('tickets.noteHint')}
                rows={6}
                disabled={!canWrite}
              />
              {canWrite && (
                <button type="submit" className="btn btn-primary w-fit" disabled={save.isPending}>
                  {save.isPending && <span className="loading loading-spinner loading-xs" />}
                  {t('common.save')}
                </button>
              )}
            </Form>
          </Formik>
        </section>
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title={t('tickets.deleteTitle')}
        text={t('tickets.deleteText')}
        confirmLabel={t('common.delete')}
        danger
        loading={remove.isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => remove.mutate({ id })}
      />
    </RequirePermission>
  );
};

export default TicketDetailScreen;
