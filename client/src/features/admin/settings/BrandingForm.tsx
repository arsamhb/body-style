'use client';

import { useTranslations } from 'next-intl';
import { getSettingsBrandingFormInitialValue } from '@/app/_service/settings/form.initialValues';
import { usePatchAdminSettingsBranding } from '@/app/_service/settings/hook.mutation';
import type { SettingsBrandingFormSchema } from '@/app/_service/settings/interface.form';
import { settingsBrandingValidationSchema } from '@/app/_service/settings/validation';
import RequirePermission from '../RequirePermission';
import ImageField from '../fields/ImageField';
import LocalizedTextInput from '../fields/LocalizedTextInput';
import SettingsForm, { useSettingsSaved } from './SettingsForm';

const BrandingForm = () => {
  const t = useTranslations('admin.settings.branding');
  const mutation = usePatchAdminSettingsBranding(useSettingsSaved());
  return (
    <RequirePermission permission="settings.branding">
      <SettingsForm<SettingsBrandingFormSchema>
        initialValues={getSettingsBrandingFormInitialValue}
        validationSchema={settingsBrandingValidationSchema}
        mutation={mutation}
      >
        <LocalizedTextInput name="siteName" label={t('siteName')} required />
        <LocalizedTextInput name="slogan" label={t('slogan')} multiline rows={2} />
        <div className="grid gap-6 md:grid-cols-2">
          <ImageField name="logoUrl" label={t('logo')} hint={t('logoHint')} aspect="aspect-[3/1]" />
          <ImageField name="logoDarkUrl" label={t('logoDark')} aspect="aspect-[3/1]" />
        </div>
        <ImageField name="faviconUrl" label={t('favicon')} aspect="aspect-square" />
      </SettingsForm>
    </RequirePermission>
  );
};

export default BrandingForm;
