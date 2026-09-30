'use client';

import { useTranslations } from 'next-intl';
import {
  getNavItemInitialValue,
  getSettingsNavigationFormInitialValue,
} from '@/app/_service/settings/form.initialValues';
import { usePatchAdminSettingsNavigation } from '@/app/_service/settings/hook.mutation';
import type { SettingsNavigationFormSchema } from '@/app/_service/settings/interface.form';
import type { NavItemSchema } from '@/app/_service/settings/interface.schema';
import { settingsNavigationValidationSchema } from '@/app/_service/settings/validation';
import { useFormikContext } from 'formik';
import RequirePermission from '../RequirePermission';
import LocalizedTextInput from '../fields/LocalizedTextInput';
import SortableList from '../fields/SortableList';
import { FormText, FormToggle } from '../ui/fields';
import { useLocales } from '../LocalesContext';
import SettingsForm, { useSettingsSaved } from './SettingsForm';

const NavList = ({ name, heading }: { name: 'navbar' | 'footer.quickLinks'; heading: string }) => {
  const t = useTranslations('admin.settings.navigation');
  const { values } = useFormikContext<SettingsNavigationFormSchema>();
  const { defaultLocale } = useLocales();
  const items: NavItemSchema[] = name === 'navbar' ? values.navbar : values.footer.quickLinks;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-h4">{heading}</h2>
      <SortableList<NavItemSchema>
        name={name}
        items={items}
        newItem={getNavItemInitialValue}
        itemTitle={(item) => item.label[defaultLocale] || item.href}
        max={12}
        renderItem={(index) => (
          <div className="grid gap-4 md:grid-cols-2">
            <LocalizedTextInput name={`${name}.${index}.label`} label={t('label')} required />
            <FormText
              name={`${name}.${index}.href`}
              label={t('href')}
              hint={t('hrefHint')}
              dir="ltr"
              required
            />
            <FormToggle name={`${name}.${index}.enabled`} label={t('enabled')} />
          </div>
        )}
      />
    </section>
  );
};

const NavigationForm = () => {
  const t = useTranslations('admin.settings.navigation');
  const mutation = usePatchAdminSettingsNavigation(useSettingsSaved());
  return (
    <RequirePermission permission="settings.navigation">
      <SettingsForm<SettingsNavigationFormSchema>
        initialValues={getSettingsNavigationFormInitialValue}
        validationSchema={settingsNavigationValidationSchema}
        mutation={mutation}
      >
        <NavList name="navbar" heading={t('navbar')} />
        <NavList name="footer.quickLinks" heading={t('quickLinks')} />
        <LocalizedTextInput name="footer.text" label={t('footerText')} multiline rows={3} />
        <LocalizedTextInput name="footer.copyright" label={t('copyright')} />
      </SettingsForm>
    </RequirePermission>
  );
};

export default NavigationForm;
