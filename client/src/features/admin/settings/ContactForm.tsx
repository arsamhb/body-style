'use client';

import { useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import {
  getContactWayInitialValue,
  getSettingsContactFormInitialValue,
} from '@/app/_service/settings/form.initialValues';
import { usePatchAdminSettingsContact } from '@/app/_service/settings/hook.mutation';
import type { SettingsContactFormSchema } from '@/app/_service/settings/interface.form';
import type { ContactWaySchema } from '@/app/_service/settings/interface.schema';
import { settingsContactValidationSchema } from '@/app/_service/settings/validation';
import { CONTACT_WAY_TYPES } from '@/features/site/types';
import RequirePermission from '../RequirePermission';
import IconPicker from '../fields/IconPicker';
import LocalizedTextInput from '../fields/LocalizedTextInput';
import SortableList from '../fields/SortableList';
import { FormSelect, FormText, FormToggle } from '../ui/fields';
import { useLocales } from '../LocalesContext';
import SettingsForm, { useSettingsSaved } from './SettingsForm';

const ContactList = () => {
  const t = useTranslations('admin.settings.contact');
  const { values } = useFormikContext<SettingsContactFormSchema>();
  const { defaultLocale } = useLocales();
  return (
    <SortableList<ContactWaySchema>
      name="contactWays"
      items={values.contactWays}
      newItem={getContactWayInitialValue}
      itemTitle={(w) => w.label[defaultLocale] || t(`types.${w.type}`)}
      max={12}
      renderItem={(index) => (
        <div className="grid gap-4 md:grid-cols-2">
          <FormSelect
            name={`contactWays.${index}.type`}
            label={t('type')}
            options={CONTACT_WAY_TYPES.map((type) => ({ value: type, label: t(`types.${type}`) }))}
          />
          <IconPicker name={`contactWays.${index}.icon`} label={t('icon')} />
          <LocalizedTextInput name={`contactWays.${index}.label`} label={t('label')} required />
          <FormText name={`contactWays.${index}.value`} label={t('value')} required />
          <div className="md:col-span-2">
            <LocalizedTextInput
              name={`contactWays.${index}.description`}
              label={t('description')}
            />
          </div>
          <FormToggle name={`contactWays.${index}.showInFooter`} label={t('showInFooter')} />
        </div>
      )}
    />
  );
};

const ContactForm = () => {
  const mutation = usePatchAdminSettingsContact(useSettingsSaved());
  return (
    <RequirePermission permission="settings.contact">
      <SettingsForm<SettingsContactFormSchema>
        initialValues={getSettingsContactFormInitialValue}
        validationSchema={settingsContactValidationSchema}
        mutation={mutation}
      >
        <ContactList />
      </SettingsForm>
    </RequirePermission>
  );
};

export default ContactForm;
