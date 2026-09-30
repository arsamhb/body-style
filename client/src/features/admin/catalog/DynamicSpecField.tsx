'use client';

import { useField } from 'formik';
import type { SpecDefinition } from '@/features/catalog/types';
import type { LocaleCode } from '@/i18n/routing';
import { useLocales } from '../LocalesContext';
import { FieldShell, FormSelect, FormText, FormToggle, useTranslateError } from '../ui/fields';

interface DynamicSpecFieldProps {
  def: SpecDefinition;
  locale: LocaleCode;
}

const MultiSelect = ({
  name,
  def,
  locale,
  label,
  required,
}: {
  name: string;
  def: SpecDefinition;
  locale: LocaleCode;
  label: string;
  required: boolean;
}) => {
  const [field, meta, helpers] = useField<string[]>(name);
  const { defaultLocale } = useLocales();
  const tErr = useTranslateError();
  const selected = new Set(field.value ?? []);
  const id = `f-${name}`;
  return (
    <FieldShell
      id={id}
      label={label}
      error={meta.touched ? tErr(meta.error) : undefined}
      required={required}
    >
      <ul className="flex flex-wrap gap-1.5" role="list">
        {def.options.map((o) => (
          <li key={o.value}>
            <label
              className={`flex cursor-pointer items-center gap-1.5 rounded-pill border px-3 py-1 text-caption ${selected.has(o.value) ? 'border-brand bg-brand text-brand-ink' : 'border-line bg-surface'}`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selected.has(o.value)}
                onChange={(e) => {
                  const next = new Set(selected);
                  if (e.target.checked) next.add(o.value);
                  else next.delete(o.value);
                  helpers.setValue([...next]);
                }}
              />
              {o.label[locale] || o.label[defaultLocale] || o.value}
            </label>
          </li>
        ))}
      </ul>
    </FieldShell>
  );
};

/** Renders the right input for a spec definition; the form stores raw values under `specs.<key>`. */
const DynamicSpecField = ({ def, locale }: DynamicSpecFieldProps) => {
  const { defaultLocale } = useLocales();
  const name = `specs.${def.key}`;
  const text = (v: Record<string, string | undefined>) => v[locale] || v[defaultLocale] || '';
  const unit = text(def.unit);
  const label = `${text(def.label) || def.key}${unit ? ` (${unit})` : def.currency ? ` (${def.currency})` : ''}`;
  switch (def.type) {
    case 'number':
    case 'price':
      return (
        <FormText
          name={name}
          type="number"
          step="any"
          label={label}
          required={def.required}
          dir="ltr"
          inputMode="decimal"
        />
      );
    case 'boolean':
      return <FormToggle name={name} label={label} />;
    case 'select':
      return (
        <FormSelect
          name={name}
          label={label}
          required={def.required}
          options={[
            { value: '', label: '—' },
            ...def.options.map((o) => ({
              value: o.value,
              label: o.label[locale] || o.label[defaultLocale] || o.value,
            })),
          ]}
        />
      );
    case 'multiselect':
      return (
        <MultiSelect name={name} def={def} locale={locale} label={label} required={def.required} />
      );
    case 'url':
      return (
        <FormText
          name={name}
          type="url"
          label={label}
          required={def.required}
          dir="ltr"
          placeholder="https://"
        />
      );
    default:
      return <FormText name={name} label={label} required={def.required} />;
  }
};

export default DynamicSpecField;
