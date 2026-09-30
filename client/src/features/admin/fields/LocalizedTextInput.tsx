'use client';

import clsx from 'clsx';
import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { LocaleCode } from '@/i18n/routing';
import { LOCALE_META } from '@/lib/i18n/locales';
import type { LocalizedString } from '@/lib/i18n/types';
import { useLocales } from '../LocalesContext';
import { FieldShell, useTranslateError } from '../ui/fields';

interface LocalizedTextInputProps {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

/**
 * One field, one tab per enabled locale. The default locale is marked and (when `required`)
 * must be filled; other locales show a dot while empty so gaps are visible at a glance.
 */
const LocalizedTextInput = ({
  name,
  label,
  hint,
  required,
  multiline,
  rows = 4,
  placeholder,
}: LocalizedTextInputProps) => {
  const t = useTranslations('admin.fields');
  const { locales, defaultLocale } = useLocales();
  const [field, meta, helpers] = useField<LocalizedString>(name);
  const [active, setActive] = useState<LocaleCode>(defaultLocale);
  const tErr = useTranslateError();
  const value = field.value ?? {};
  const error = meta.touched
    ? tErr(typeof meta.error === 'string' ? meta.error : undefined)
    : undefined;
  const id = `f-${name}-${active}`;

  const set = (locale: LocaleCode, text: string) => helpers.setValue({ ...value, [locale]: text });
  const Tag = multiline ? 'textarea' : 'input';

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <div
        className={clsx('rounded-md border bg-surface', error ? 'border-danger' : 'border-line')}
      >
        {locales.length > 1 && (
          <div role="tablist" className="flex gap-1 border-b border-line px-1.5 pt-1.5">
            {locales.map((locale) => {
              const filled = Boolean(value[locale]?.trim());
              return (
                <button
                  key={locale}
                  type="button"
                  role="tab"
                  aria-selected={active === locale}
                  onClick={() => setActive(locale)}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-t-sm px-2.5 py-1.5 text-caption font-medium transition-colors',
                    active === locale
                      ? 'bg-surface-raised text-ink'
                      : 'text-ink-muted hover:text-ink'
                  )}
                >
                  <span lang={locale}>{LOCALE_META[locale].nativeLabel}</span>
                  {locale === defaultLocale ? (
                    <span className="rounded-pill bg-brand px-1.5 text-[10px] text-brand-ink">
                      {t('defaultLocaleBadge')}
                    </span>
                  ) : (
                    !filled && (
                      <span
                        className="size-1.5 rounded-full bg-warning"
                        title={t('localeMissing')}
                      />
                    )
                  )}
                </button>
              );
            })}
          </div>
        )}
        <Tag
          id={id}
          lang={active}
          dir={LOCALE_META[active].dir}
          rows={multiline ? rows : undefined}
          value={value[active] ?? ''}
          placeholder={placeholder}
          onChange={(e) => set(active, e.target.value)}
          onBlur={() => helpers.setTouched(true)}
          className={clsx(
            'w-full bg-transparent px-3 py-2.5 text-body outline-none',
            multiline && 'resize-y'
          )}
        />
      </div>
    </FieldShell>
  );
};

export default LocalizedTextInput;
