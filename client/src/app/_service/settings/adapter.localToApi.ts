import type { LocalizedString } from '@/lib/i18n/types';
import type {
  SettingsBrandingFormSchema,
  SettingsContactFormSchema,
  SettingsLocalesFormSchema,
  SettingsNavigationFormSchema,
  SettingsSeoFormSchema,
} from './interface.form';
import type {
  AdminSettingsBrandingUpdatePayload,
  AdminSettingsContactUpdatePayload,
  AdminSettingsLocalesUpdatePayload,
  AdminSettingsNavigationUpdatePayload,
  AdminSettingsSeoUpdatePayload,
} from './interface.payload';
import type { ContactWaySchema, NavItemSchema } from './interface.schema';

/** Empty translations are dropped so the public site falls back to the default locale. */
export const cleanLocalized = (value: LocalizedString | undefined): LocalizedString =>
  Object.fromEntries(
    Object.entries(value ?? {}).filter(([, v]) => typeof v === 'string' && v.trim() !== '')
  );

const navItem = (item: NavItemSchema, index: number) => ({
  id: item.id || undefined,
  label: cleanLocalized(item.label),
  href: item.href.trim(),
  order: index,
  enabled: item.enabled,
});

const contactWay = (way: ContactWaySchema, index: number) => ({
  id: way.id || undefined,
  type: way.type,
  icon: way.icon,
  label: cleanLocalized(way.label),
  value: way.value.trim(),
  description: cleanLocalized(way.description),
  showInFooter: way.showInFooter,
  order: index,
});

export const settingsBrandingFormSchema2AdminSettingsBrandingUpdatePayload = (
  form: SettingsBrandingFormSchema
): AdminSettingsBrandingUpdatePayload => ({
  siteName: cleanLocalized(form.siteName),
  slogan: cleanLocalized(form.slogan),
  logoUrl: form.logoUrl,
  logoDarkUrl: form.logoDarkUrl,
  faviconUrl: form.faviconUrl,
});

export const settingsNavigationFormSchema2AdminSettingsNavigationUpdatePayload = (
  form: SettingsNavigationFormSchema
): AdminSettingsNavigationUpdatePayload => ({
  navbar: form.navbar.map(navItem),
  footer: {
    quickLinks: form.footer.quickLinks.map(navItem),
    text: cleanLocalized(form.footer.text),
    copyright: cleanLocalized(form.footer.copyright),
  },
});

export const settingsContactFormSchema2AdminSettingsContactUpdatePayload = (
  form: SettingsContactFormSchema
): AdminSettingsContactUpdatePayload => ({ contactWays: form.contactWays.map(contactWay) });

export const settingsSeoFormSchema2AdminSettingsSeoUpdatePayload = (
  form: SettingsSeoFormSchema
): AdminSettingsSeoUpdatePayload => ({
  titleTemplate: cleanLocalized(form.titleTemplate),
  description: cleanLocalized(form.description),
  ogImageUrl: form.ogImageUrl,
});

export const settingsLocalesFormSchema2AdminSettingsLocalesUpdatePayload = (
  form: SettingsLocalesFormSchema
): AdminSettingsLocalesUpdatePayload => ({ enabledLocales: form.enabledLocales });
