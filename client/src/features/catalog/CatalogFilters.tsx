'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { LocaleCode } from '@/i18n/routing';
import IconByName from '@/shared/UI/IconByName';
import type { CatalogTypePublic, PublicFilterDefinition } from './types';

interface CatalogFiltersProps {
  type: CatalogTypePublic;
  total: number;
}

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

/**
 * Filter sidebar driven entirely by the type's public definition. State lives in the URL, so
 * results are shareable and server-rendered; the API re-validates every param against the
 * whitelist, this UI is only a convenience.
 */
const CatalogFilters = ({ type, total }: CatalogFiltersProps) => {
  const t = useTranslations('catalog');
  const locale = useLocale() as LocaleCode;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const currentQ = searchParams.get('q') ?? '';

  const update = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete('offset');
    startTransition(() =>
      router.replace(`${pathname}${params.size ? `?${params}` : ''}`, { scroll: false })
    );
  };
  const setParam = (key: string, value: string | null) =>
    update((p) => (value ? p.set(key, value) : p.delete(key)));
  const toggleInList = (key: string, value: string) =>
    update((p) => {
      const current = new Set(list(p.get(key)));
      if (current.has(value)) current.delete(value);
      else current.add(value);
      if (current.size) p.set(key, [...current].join(','));
      else p.delete(key);
    });

  const activeCount = [...searchParams.keys()].filter(
    (k) => k !== 'sort' && k !== 'limit' && k !== 'offset'
  ).length;
  const hasFilters =
    (type.categoriesEnabled && type.categories.length > 0) ||
    type.filters.length > 0 ||
    type.searchEnabled;

  const renderFilter = (f: PublicFilterDefinition) => {
    const key = `spec.${f.key}`;
    switch (f.type) {
      case 'select':
      case 'multiselect': {
        const selected = new Set(list(searchParams.get(key)));
        return (
          <ul className="flex flex-wrap gap-1.5" role="list">
            {f.options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  aria-pressed={selected.has(o.value)}
                  onClick={() => toggleInList(key, o.value)}
                  className={clsx(
                    'rounded-pill border px-3 py-1 text-caption font-medium transition-colors',
                    selected.has(o.value)
                      ? 'border-brand bg-brand text-brand-ink'
                      : 'border-line bg-surface text-ink-muted hover:border-ink hover:text-ink'
                  )}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        );
      }
      case 'boolean': {
        const v = searchParams.get(key);
        return (
          <div className="flex gap-1.5">
            {[
              ['true', t('yes')],
              ['false', t('no')],
            ].map(([val, label]) => (
              <button
                key={val}
                type="button"
                aria-pressed={v === val}
                onClick={() => setParam(key, v === val ? null : val)}
                className={clsx(
                  'rounded-pill border px-3 py-1 text-caption font-medium',
                  v === val
                    ? 'border-brand bg-brand text-brand-ink'
                    : 'border-line bg-surface text-ink-muted hover:text-ink'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        );
      }
      case 'number':
      case 'price':
        return (
          <div className="flex items-center gap-2" dir="ltr">
            <input
              type="number"
              inputMode="numeric"
              placeholder={t('min')}
              defaultValue={searchParams.get(`${key}.min`) ?? ''}
              onBlur={(e) => setParam(`${key}.min`, e.target.value || null)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                setParam(`${key}.min`, (e.target as HTMLInputElement).value || null)
              }
              className="w-full rounded-md border border-line bg-surface px-2 py-1.5 text-small"
            />
            <span className="text-ink-subtle">–</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder={t('max')}
              defaultValue={searchParams.get(`${key}.max`) ?? ''}
              onBlur={(e) => setParam(`${key}.max`, e.target.value || null)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                setParam(`${key}.max`, (e.target as HTMLInputElement).value || null)
              }
              className="w-full rounded-md border border-line bg-surface px-2 py-1.5 text-small"
            />
            {(f.unit || f.currency) && (
              <span className="text-caption text-ink-subtle">{f.unit || f.currency}</span>
            )}
          </div>
        );
      case 'text':
        return (
          <input
            type="search"
            defaultValue={searchParams.get(key) ?? ''}
            onBlur={(e) => setParam(key, e.target.value || null)}
            onKeyDown={(e) =>
              e.key === 'Enter' && setParam(key, (e.target as HTMLInputElement).value || null)
            }
            className="w-full rounded-md border border-line bg-surface px-3 py-1.5 text-small"
          />
        );
      default:
        return null;
    }
  };

  const sortOptions = [
    { value: '', label: t('sortDefault') },
    { value: 'createdAt:desc', label: t('sortNewest') },
    { value: 'title:asc', label: t('sortTitle') },
    ...(type.sortSpecs ?? []).flatMap((s) => [
      { value: `${s.key}:asc`, label: `${s.label} ↑` },
      { value: `${s.key}:desc`, label: `${s.label} ↓` },
    ]),
  ];

  const panel = (
    <div className="flex flex-col gap-6">
      {type.searchEnabled && (
        <form
          key={currentQ}
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const value = (new FormData(e.currentTarget).get('q') as string) ?? '';
            setParam('q', value.trim() || null);
          }}
          className="relative"
        >
          <IconByName
            name="search"
            className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
          />
          <input
            name="q"
            type="search"
            defaultValue={currentQ}
            placeholder={t('searchPlaceholder')}
            aria-label={t('search')}
            className="w-full rounded-md border border-line bg-surface py-2 ps-9 pe-3 text-small focus:border-ink focus:outline-none"
          />
        </form>
      )}
      {type.categoriesEnabled && type.categories.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-small font-semibold">{t('category')}</legend>
          <ul className="flex flex-wrap gap-1.5" role="list">
            {[{ slug: '', name: t('allCategories') }, ...type.categories].map((c) => {
              const active = c.slug
                ? list(searchParams.get('category')).includes(c.slug)
                : !searchParams.get('category');
              return (
                <li key={c.slug || 'all'}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      c.slug ? toggleInList('category', c.slug) : setParam('category', null)
                    }
                    className={clsx(
                      'rounded-pill border px-3 py-1 text-caption font-medium transition-colors',
                      active
                        ? 'border-brand bg-brand text-brand-ink'
                        : 'border-line bg-surface text-ink-muted hover:border-ink hover:text-ink'
                    )}
                  >
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}
      {type.filters.map((f) => (
        <fieldset key={f.key} className="flex flex-col gap-2">
          <legend className="mb-2 text-small font-semibold">{f.label}</legend>
          {renderFilter(f)}
        </fieldset>
      ))}
      {activeCount > 0 && (
        <button
          type="button"
          className="btn btn-ghost btn-sm w-fit text-danger"
          onClick={() => update((p) => [...p.keys()].forEach((k) => p.delete(k)))}
        >
          <IconByName name="x" className="size-4" />
          {t('clearFilters')}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p
          className={clsx('text-small text-ink-muted', pending && 'opacity-60')}
          aria-live="polite"
        >
          {t('results', { count: total })}
        </p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-small text-ink-muted">
            <span className="hidden sm:inline">{t('sort')}</span>
            <select
              value={searchParams.get('sort') ?? ''}
              onChange={(e) => setParam('sort', e.target.value || null)}
              className="rounded-md border border-line bg-surface px-2 py-1.5 text-small"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          {hasFilters && (
            <button
              type="button"
              className="btn btn-sm lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              <IconByName name="sliders-horizontal" className="size-4" />
              {t('filters')}
              {activeCount > 0 && (
                <span className="badge badge-sm badge-primary">{activeCount}</span>
              )}
            </button>
          )}
        </div>
      </div>
      {hasFilters && (
        <aside
          className={clsx(
            'rounded-lg border border-line bg-canvas-subtle p-4 lg:block lg:border-0 lg:bg-transparent lg:p-0',
            open ? 'block' : 'hidden'
          )}
          lang={locale}
        >
          {panel}
        </aside>
      )}
    </div>
  );
};

export default CatalogFilters;
