import type {
  SettingsBrandingFormSchema,
  SettingsContactFormSchema,
  SettingsLocalesFormSchema,
  SettingsNavigationFormSchema,
  SettingsSeoFormSchema,
} from './interface.form';
import type { ContactWaySchema, NavItemSchema, SettingsSchema } from './interface.schema';

const newId = () => `tmp-${Math.random().toString(36).slice(2, 10)}`;

export const getNavItemInitialValue = (): NavItemSchema => ({
  id: newId(),
  label: {},
  href: '/',
  order: 0,
  enabled: true,
});

export const getContactWayInitialValue = (): ContactWaySchema => ({
  id: newId(),
  type: 'phone',
  icon: 'phone',
  label: {},
  value: '',
  description: {},
  showInFooter: true,
  order: 0,
});

export const getSettingsBrandingFormInitialValue = (
  s?: SettingsSchema
): SettingsBrandingFormSchema => ({
  siteName: s?.siteName ?? {},
  slogan: s?.slogan ?? {},
  logoUrl: s?.logoUrl ?? '',
  logoDarkUrl: s?.logoDarkUrl ?? '',
  faviconUrl: s?.faviconUrl ?? '',
});

export const getSettingsNavigationFormInitialValue = (
  s?: SettingsSchema
): SettingsNavigationFormSchema => ({
  navbar: s?.navbar ?? [],
  footer: {
    quickLinks: s?.footer.quickLinks ?? [],
    text: s?.footer.text ?? {},
    copyright: s?.footer.copyright ?? {},
  },
});

export const getSettingsContactFormInitialValue = (
  s?: SettingsSchema
): SettingsContactFormSchema => ({
  contactWays: s?.contactWays ?? [],
});

export const getSettingsSeoFormInitialValue = (s?: SettingsSchema): SettingsSeoFormSchema => ({
  titleTemplate: s?.seo.titleTemplate ?? {},
  description: s?.seo.description ?? {},
  ogImageUrl: s?.seo.ogImageUrl ?? '',
});

export const getSettingsLocalesFormInitialValue = (
  s?: SettingsSchema
): SettingsLocalesFormSchema => ({
  enabledLocales: s?.enabledLocales ?? [],
});
