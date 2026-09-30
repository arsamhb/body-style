'use client';

import clsx from 'clsx';
import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import IconByName, { ICON_NAMES } from '@/shared/UI/IconByName';
import { FieldShell } from '../ui/fields';

interface IconPickerProps {
  name: string;
  label: string;
}

/** Choose from the client-side icon whitelist. Stores the kebab-case icon name. */
const IconPicker = ({ name, label }: IconPickerProps) => {
  const t = useTranslations('admin.fields');
  const [field, , helpers] = useField<string>(name);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const names = useMemo(
    () => ICON_NAMES.filter((n) => n.includes(query.trim().toLowerCase())),
    [query]
  );
  const id = `f-${name}`;

  return (
    <FieldShell id={id} label={label}>
      <div className="relative">
        <button
          type="button"
          id={id}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex h-10 w-full items-center gap-2 rounded-md border border-line bg-surface px-3 text-small"
        >
          <IconByName name={field.value || 'sparkles'} className="size-4" />
          <span className="text-ink-muted">{field.value || t('chooseIcon')}</span>
          <IconByName name="chevron-down" className="ms-auto size-4 text-ink-subtle" />
        </button>
        {open && (
          <div className="absolute z-30 mt-1 w-72 rounded-lg border border-line bg-canvas p-2 shadow-lg">
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchIcon')}
              className="input input-sm mb-2 w-full"
            />
            <div className="grid max-h-56 grid-cols-6 gap-1 overflow-y-auto">
              {names.map((n) => (
                <button
                  key={n}
                  type="button"
                  title={n}
                  onClick={() => {
                    helpers.setValue(n);
                    setOpen(false);
                  }}
                  className={clsx(
                    'grid aspect-square place-items-center rounded-md border border-transparent hover:border-line hover:bg-surface-raised',
                    field.value === n && 'border-brand bg-brand-soft'
                  )}
                >
                  <IconByName name={n} className="size-4" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </FieldShell>
  );
};

export default IconPicker;
