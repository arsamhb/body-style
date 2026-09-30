'use client';

import { useTranslations } from 'next-intl';
import { getSettingsSeoFormInitialValue } from '@/app/_service/settings/form.initialValues';
import { usePatchAdminSettingsSeo } from '@/app/_service/settings/hook.mutation';
import type { SettingsSeoFormSchema } from '@/app/_service/settings/interface.form';
import { settingsSeoValidationSchema } from '@/app/_service/settings/validation';
import RequirePermission from '../RequirePermission';
import ImageField from '../fields/ImageField';
import LocalizedTextInput from '../fields/LocalizedTextInput';
import SettingsForm, { useSettingsSaved } from './SettingsForm';

const SeoForm = () => {
  const t = useTranslations('admin.settings.seo');
  const mutation = usePatchAdminSettingsSeo(useSettingsSaved());
  return (
    <RequirePermission permission="settings.seo">
      <SettingsForm<SettingsSeoFormSchema>
        initialValues={getSettingsSeoFormInitialValue}
        validationSchema={settingsSeoValidationSchema}
        mutation={mutation}
      >
        <LocalizedTextInput
          name="titleTemplate"
          label={t('titleTemplate')}
          hint={t('titleTemplateHint')}
        />
        <LocalizedTextInput name="description" label={t('description')} multiline rows={3} />
        <ImageField name="ogImageUrl" label={t('ogImage')} aspect="aspect-[1.91/1]" />
      </SettingsForm>
    </RequirePermission>
  );
};

export default SeoForm;
