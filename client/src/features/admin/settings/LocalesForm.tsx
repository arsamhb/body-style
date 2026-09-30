'use client';

import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import { getSettingsLocalesFormInitialValue } from '@/app/_service/settings/form.initialValues';
import { usePatchAdminSettingsLocales } from '@/app/_service/settings/hook.mutation';
import type { SettingsLocalesFormSchema } from '@/app/_service/settings/interface.form';
import { settingsLocalesValidationSchema } from '@/app/_service/settings/validation';
import type { LocaleCode } from '@/i18n/routing';
import { LOCALE_META } from '@/lib/i18n/locales';
import RequirePermission from '../RequirePermission';
import SettingsForm, { useSettingsSaved } from './SettingsForm';

const LocaleChecklist = ({
  supported,
  defaultLocale,
}: {
  supported: LocaleCode[];
  defaultLocale: LocaleCode;
}) => {
  const t = useTranslations('admin.settings.locales');
  const [field, , helpers] = useField<LocaleCode[]>('enabledLocales');
  const selected = new Set(field.value);
  return (
    <ul className="flex flex-col gap-2" role="list">
      {supported.map((code) => {
        const isDefault = code === defaultLocale;
        return (
          <li key={code}>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={isDefault || selected.has(code)}
                disabled={isDefault}
                onChange={(e) => {
                  const next = new Set(selected);
                  if (e.target.checked) next.add(code);
                  else next.delete(code);
                  helpers.setValue([...next]);
                }}
              />
              <span lang={code} dir={LOCALE_META[code].dir} className="text-body font-medium">
                {LOCALE_META[code].nativeLabel}
              </span>
              <span className="text-caption text-ink-subtle" dir="ltr">
                {code} · {LOCALE_META[code].dir.toUpperCase()}
              </span>
              {isDefault && (
                <span className="badge badge-sm badge-primary ms-auto">{t('default')}</span>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
};

const LocalesForm = () => {
  const t = useTranslations('admin.settings.locales');
  const mutation = usePatchAdminSettingsLocales(useSettingsSaved());
  return (
    <RequirePermission developerOnly>
      <SettingsForm<SettingsLocalesFormSchema>
        initialValues={getSettingsLocalesFormInitialValue}
        validationSchema={settingsLocalesValidationSchema}
        mutation={mutation}
      >
        {(settings) => (
          <section className="flex flex-col gap-3">
            <h2 className="text-h4">{t('title')}</h2>
            <p className="text-small text-ink-muted">{t('hint')}</p>
            <LocaleChecklist
              supported={settings.supportedLocales}
              defaultLocale={settings.defaultLocale}
            />
          </section>
        )}
      </SettingsForm>
    </RequirePermission>
  );
};

export default LocalesForm;
