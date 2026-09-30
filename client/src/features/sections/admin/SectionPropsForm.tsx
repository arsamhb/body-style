'use client';

import { Form, Formik, getIn, useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import type { AdminSection } from '../types';
import { SECTION_FIELD_SPECS, type FieldSpec } from '../fieldSpecs';
import ImageField from '@/features/admin/fields/ImageField';
import IconPicker from '@/features/admin/fields/IconPicker';
import LocalizedTextInput from '@/features/admin/fields/LocalizedTextInput';
import SortableList from '@/features/admin/fields/SortableList';
import { useLocales } from '@/features/admin/LocalesContext';
import { FormSelect, FormText, FormToggle } from '@/features/admin/ui/fields';
import { applyApiValidationErrorsToFormik } from '@/lib/api/applyFormikValidationErrors';
import type { LocalizedString } from '@/lib/i18n/types';

const join = (prefix: string, name: string) => (prefix ? `${prefix}.${name}` : name);

const CtaFields = ({ name, required }: { name: string; required?: boolean }) => {
  const t = useTranslations('admin.sections');
  const { values, setFieldValue } = useFormikContext<Record<string, unknown>>();
  const present = Boolean(getIn(values, name));
  if (!present && !required) {
    return (
      <div className="flex items-center justify-between rounded-md border border-dashed border-line-strong px-4 py-3">
        <span className="text-small text-ink-muted">{t(`fields.${name.split('.').pop()}`)}</span>
        <button
          type="button"
          className="btn btn-outline btn-xs"
          onClick={() => setFieldValue(name, { label: {}, href: '/' })}
        >
          {t('addCta')}
        </button>
      </div>
    );
  }
  return (
    <fieldset className="grid gap-4 rounded-md border border-line p-4 md:grid-cols-2">
      <legend className="flex items-center gap-2 px-1 text-small font-medium">
        {t(`fields.${name.split('.').pop()}`)}
        {!required && (
          <button
            type="button"
            className="btn btn-ghost btn-xs text-danger"
            onClick={() => setFieldValue(name, null)}
          >
            {t('removeCta')}
          </button>
        )}
      </legend>
      <LocalizedTextInput name={`${name}.label`} label={t('fields.label')} required />
      <FormText
        name={`${name}.href`}
        label={t('fields.href')}
        dir="ltr"
        placeholder="/contact"
        required
      />
    </fieldset>
  );
};

const ListField = ({
  spec,
  prefix,
}: {
  spec: Extract<FieldSpec, { kind: 'list' }>;
  prefix: string;
}) => {
  const t = useTranslations('admin.sections');
  const { values } = useFormikContext<Record<string, unknown>>();
  const { defaultLocale } = useLocales();
  const name = join(prefix, spec.name);
  const items = (getIn(values, name) ?? []) as Record<string, unknown>[];
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-small font-semibold">{t(`fields.${spec.name}`)}</h3>
      <SortableList<Record<string, unknown>>
        name={name}
        items={items}
        newItem={spec.newItem}
        max={spec.max}
        itemTitle={(item) => {
          const v = spec.titleField ? item[spec.titleField] : undefined;
          if (v && typeof v === 'object') return (v as LocalizedString)[defaultLocale] ?? '';
          return typeof v === 'string' ? v : '';
        }}
        renderItem={(index) => <FieldList specs={spec.fields} prefix={`${name}.${index}`} />}
      />
    </section>
  );
};

const FieldList = ({ specs, prefix }: { specs: FieldSpec[]; prefix: string }) => {
  const t = useTranslations('admin.sections');
  return (
    <>
      {specs.map((spec) => {
        const name = join(prefix, spec.name);
        const label = t(`fields.${spec.name}`);
        switch (spec.kind) {
          case 'localized':
            return (
              <LocalizedTextInput
                key={name}
                name={name}
                label={label}
                required={spec.required}
                multiline={spec.multiline}
                rows={spec.rows}
              />
            );
          case 'text':
            return (
              <FormText
                key={name}
                name={name}
                label={label}
                required={spec.required}
                dir={spec.dir}
                placeholder={spec.placeholder}
              />
            );
          case 'number':
            return (
              <FormText
                key={name}
                name={name}
                type="number"
                label={label}
                min={spec.min}
                max={spec.max}
                dir="ltr"
              />
            );
          case 'boolean':
            return <FormToggle key={name} name={name} label={label} />;
          case 'image':
            return (
              <ImageField
                key={name}
                name={name}
                label={label}
                aspect={spec.aspect}
                required={spec.required}
              />
            );
          case 'icon':
            return <IconPicker key={name} name={name} label={label} />;
          case 'select':
            return (
              <FormSelect
                key={name}
                name={name}
                label={label}
                options={spec.options.map((value) => ({
                  value,
                  label: t(`options.${spec.name}.${value}`),
                }))}
              />
            );
          case 'cta':
            return <CtaFields key={name} name={name} required={spec.required} />;
          case 'group':
            return (
              <fieldset
                key={name}
                className="flex flex-col gap-4 rounded-md border border-line p-4"
              >
                <legend className="px-1 text-small font-medium">{label}</legend>
                <FieldList specs={spec.fields} prefix={name} />
              </fieldset>
            );
          case 'list':
            return <ListField key={name} spec={spec} prefix={prefix} />;
        }
      })}
    </>
  );
};

interface SectionPropsFormProps {
  formId: string;
  section: AdminSection;
  onSubmit: (props: Record<string, unknown>, helpers: { onError: (err: unknown) => void }) => void;
}

/** Edits `section.props` for any section type, driven by `SECTION_FIELD_SPECS`. */
const SectionPropsForm = ({ formId, section, onSubmit }: SectionPropsFormProps) => (
  <Formik<Record<string, unknown>>
    initialValues={section.props as Record<string, unknown>}
    enableReinitialize
    onSubmit={(values, { setFieldError }) =>
      onSubmit(values, {
        // Server details arrive as `props.items[0].title`; strip the prefix to match form paths.
        onError: (err) =>
          applyApiValidationErrorsToFormik(
            (field, message) => setFieldError(field.replace(/^props\.?/, ''), message),
            err
          ),
      })
    }
  >
    <Form id={formId} noValidate className="flex flex-col gap-5">
      <FieldList specs={SECTION_FIELD_SPECS[section.type]} prefix="" />
    </Form>
  </Formik>
);

export default SectionPropsForm;
