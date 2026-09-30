'use client';

import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { LocaleCode } from '@/i18n/routing';
import { usePatchAdminTicketsStatusById } from '@/app/_service/tickets/hook.mutation';
import {
  ADMIN_DASHBOARD_QUERY_KEY,
  ADMIN_TICKETS_LIST_QUERY_KEY,
  useGetAdminTicketsPaginatedList,
} from '@/app/_service/tickets/hook.query';
import {
  TICKET_SOURCE_PAGES,
  TICKET_STATUSES,
  type TicketSourcePage,
  type TicketStatus,
} from '@/app/_service/tickets/interface.response';
import { LOCALE_META } from '@/lib/i18n/locales';
import IconByName from '@/shared/UI/IconByName';
import Loading from '@/shared/UI/Loading';
import Can from '../Can';
import RequirePermission from '../RequirePermission';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import StatusBadge from '../ui/StatusBadge';
import { SOURCE_ICON, STATUS_TONE } from './ticketUi';

export const SourceBadge = ({
  source,
}: {
  source: { page: TicketSourcePage; section: string; itemSlug: string; itemTitle: string };
}) => {
  const t = useTranslations('admin.tickets');
  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-caption text-ink-muted">
      <IconByName name={SOURCE_ICON[source.page]} className="size-3.5" />
      <span className="font-medium text-ink">{t(`pages.${source.page}`)}</span>
      {source.section && (
        <>
          <IconByName name="chevron-right" className="size-3 rtl:-scale-x-100" />
          <code dir="ltr">{source.section}</code>
        </>
      )}
      {source.itemTitle && (
        <>
          <IconByName name="chevron-right" className="size-3 rtl:-scale-x-100" />
          <span>{source.itemTitle}</span>
        </>
      )}
    </span>
  );
};

const TicketsScreen = () => {
  const t = useTranslations('admin');
  const locale = useLocale() as LocaleCode;
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [sourcePage, setSourcePage] = useState<TicketSourcePage | ''>('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const limit = 20;
  const { data, isLoading } = useGetAdminTicketsPaginatedList({
    query: {
      limit,
      offset: page * limit,
      status: status || undefined,
      page: sourcePage || undefined,
      q: q || undefined,
    },
  });
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [ADMIN_TICKETS_LIST_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_QUERY_KEY });
  };
  const setStatusMut = usePatchAdminTicketsStatusById(() => invalidate());
  const fmt = new Intl.DateTimeFormat(LOCALE_META[locale].bcp47, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <RequirePermission permission="tickets.read">
      <PageHeader title={t('tickets.title')} subtitle={t('tickets.subtitle')} />
      <div className="flex flex-wrap items-center gap-2">
        <div role="tablist" className="flex gap-1 rounded-md border border-line bg-surface p-1">
          {(['', ...TICKET_STATUSES] as const).map((s) => (
            <button
              key={s || 'all'}
              type="button"
              role="tab"
              aria-selected={status === s}
              onClick={() => (setStatus(s), setPage(0))}
              className={clsx(
                'rounded-sm px-3 py-1 text-caption font-medium',
                status === s ? 'bg-brand text-brand-ink' : 'text-ink-muted hover:text-ink'
              )}
            >
              {s ? t(`tickets.status.${s}`) : t('tickets.all')}
            </button>
          ))}
        </div>
        <select
          className="select select-sm"
          value={sourcePage}
          onChange={(e) => (setSourcePage(e.target.value as TicketSourcePage | ''), setPage(0))}
          aria-label={t('tickets.source')}
        >
          <option value="">{t('tickets.allSources')}</option>
          {TICKET_SOURCE_PAGES.map((p) => (
            <option key={p} value={p}>
              {t(`tickets.pages.${p}`)}
            </option>
          ))}
        </select>
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            setQ((new FormData(e.currentTarget).get('q') as string) ?? '');
            setPage(0);
          }}
        >
          <IconByName
            name="search"
            className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
          />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder={t('common.search')}
            className="input input-sm ps-9"
          />
        </form>
      </div>
      {isLoading ? (
        <Loading size="md" />
      ) : !data?.data.length ? (
        <EmptyState icon="inbox" title={t('tickets.empty')} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="table">
            <thead>
              <tr>
                <th>{t('tickets.requester')}</th>
                <th>{t('tickets.message')}</th>
                <th>{t('tickets.source')}</th>
                <th>{t('tickets.status.label')}</th>
                <th>{t('tickets.date')}</th>
                <th className="text-end">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((ticket) => (
                <tr
                  key={ticket.id}
                  className={clsx(
                    'hover:bg-surface-raised/60',
                    ticket.status === 'new' && 'font-medium'
                  )}
                >
                  <td>
                    <div className="flex flex-col">
                      <span>{ticket.name}</span>
                      <a
                        href={`tel:${ticket.phone}`}
                        className="text-caption text-ink-muted hover:text-ink"
                        dir="ltr"
                      >
                        {ticket.phone}
                      </a>
                    </div>
                  </td>
                  <td className="max-w-xs">
                    <p className="line-clamp-2 text-small text-ink-muted">
                      {ticket.message || '—'}
                    </p>
                  </td>
                  <td>
                    <SourceBadge source={ticket.source} />
                  </td>
                  <td>
                    <Can
                      permission="tickets.write"
                      fallback={
                        <StatusBadge tone={STATUS_TONE[ticket.status]}>
                          {t(`tickets.status.${ticket.status}`)}
                        </StatusBadge>
                      }
                    >
                      <select
                        className="select select-xs"
                        value={ticket.status}
                        disabled={setStatusMut.isPending}
                        onChange={(e) =>
                          setStatusMut.mutate({
                            id: ticket.id,
                            status: e.target.value as TicketStatus,
                          })
                        }
                        aria-label={t('tickets.status.label')}
                      >
                        {TICKET_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {t(`tickets.status.${s}`)}
                          </option>
                        ))}
                      </select>
                    </Can>
                  </td>
                  <td className="whitespace-nowrap text-caption text-ink-muted">
                    {fmt.format(ticket.createdAt)}
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <Link href={`/admin/tickets/${ticket.id}`} className="btn btn-ghost btn-sm">
                        <IconByName name="eye" className="size-4" />
                        {t('tickets.open')}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.total_pages > 1 && (
            <div className="flex items-center justify-between border-t border-line px-4 py-3 text-small text-ink-muted">
              <span>{t('tickets.count', { count: data.total })}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <IconByName name="chevron-left" className="size-4 rtl:-scale-x-100" />
                </button>
                <span className="self-center">
                  {page + 1} / {data.total_pages}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  disabled={page + 1 >= data.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <IconByName name="chevron-right" className="size-4 rtl:-scale-x-100" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </RequirePermission>
  );
};

export default TicketsScreen;
