import api from '@/lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { adminSettingsReadResponse2SettingsSchema } from './adapter.apiToLocal';
import {
  settingsBrandingFormSchema2AdminSettingsBrandingUpdatePayload,
  settingsContactFormSchema2AdminSettingsContactUpdatePayload,
  settingsLocalesFormSchema2AdminSettingsLocalesUpdatePayload,
  settingsNavigationFormSchema2AdminSettingsNavigationUpdatePayload,
  settingsSeoFormSchema2AdminSettingsSeoUpdatePayload,
} from './adapter.localToApi';
import type {
  SettingsBrandingFormSchema,
  SettingsContactFormSchema,
  SettingsLocalesFormSchema,
  SettingsNavigationFormSchema,
  SettingsSeoFormSchema,
} from './interface.form';
import type { SettingsSchema } from './interface.schema';
import {
  ADMIN_SETTINGS_BRANDING_ROUTE,
  ADMIN_SETTINGS_CONTACT_ROUTE,
  ADMIN_SETTINGS_LOCALES_ROUTE,
  ADMIN_SETTINGS_NAVIGATION_ROUTE,
  ADMIN_SETTINGS_SEO_ROUTE,
} from './route.api';

type OnSuccess = (data: SettingsSchema) => void;

const usePatchAdminSettingsBranding = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-settings-branding'],
    mutationFn: ({ payload }: { payload: SettingsBrandingFormSchema }) =>
      api.patch<SettingsBrandingFormSchema, SettingsSchema>(
        ADMIN_SETTINGS_BRANDING_ROUTE,
        settingsBrandingFormSchema2AdminSettingsBrandingUpdatePayload,
        adminSettingsReadResponse2SettingsSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminSettingsNavigation = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-settings-navigation'],
    mutationFn: ({ payload }: { payload: SettingsNavigationFormSchema }) =>
      api.patch<SettingsNavigationFormSchema, SettingsSchema>(
        ADMIN_SETTINGS_NAVIGATION_ROUTE,
        settingsNavigationFormSchema2AdminSettingsNavigationUpdatePayload,
        adminSettingsReadResponse2SettingsSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminSettingsContact = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-settings-contact'],
    mutationFn: ({ payload }: { payload: SettingsContactFormSchema }) =>
      api.patch<SettingsContactFormSchema, SettingsSchema>(
        ADMIN_SETTINGS_CONTACT_ROUTE,
        settingsContactFormSchema2AdminSettingsContactUpdatePayload,
        adminSettingsReadResponse2SettingsSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminSettingsSeo = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-settings-seo'],
    mutationFn: ({ payload }: { payload: SettingsSeoFormSchema }) =>
      api.patch<SettingsSeoFormSchema, SettingsSchema>(
        ADMIN_SETTINGS_SEO_ROUTE,
        settingsSeoFormSchema2AdminSettingsSeoUpdatePayload,
        adminSettingsReadResponse2SettingsSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

const usePatchAdminSettingsLocales = (onSuccess?: OnSuccess) =>
  useMutation({
    mutationKey: ['patch-admin-settings-locales'],
    mutationFn: ({ payload }: { payload: SettingsLocalesFormSchema }) =>
      api.patch<SettingsLocalesFormSchema, SettingsSchema>(
        ADMIN_SETTINGS_LOCALES_ROUTE,
        settingsLocalesFormSchema2AdminSettingsLocalesUpdatePayload,
        adminSettingsReadResponse2SettingsSchema
      )(payload),
    onSuccess: (data) => onSuccess?.(data),
  });

export {
  usePatchAdminSettingsBranding,
  usePatchAdminSettingsContact,
  usePatchAdminSettingsLocales,
  usePatchAdminSettingsNavigation,
  usePatchAdminSettingsSeo,
};
