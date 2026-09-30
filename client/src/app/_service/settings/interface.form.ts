import type { LocaleCode } from '@/i18n/routing';
import type { LocalizedString } from '@/lib/i18n/types';
import type { ContactWaySchema, NavItemSchema } from './interface.schema';

export interface SettingsBrandingFormSchema {
  siteName: LocalizedString;
  slogan: LocalizedString;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
}

export interface SettingsNavigationFormSchema {
  navbar: NavItemSchema[];
  footer: { quickLinks: NavItemSchema[]; text: LocalizedString; copyright: LocalizedString };
}

export interface SettingsContactFormSchema {
  contactWays: ContactWaySchema[];
}

export interface SettingsSeoFormSchema {
  titleTemplate: LocalizedString;
  description: LocalizedString;
  ogImageUrl: string;
}

export interface SettingsLocalesFormSchema {
  enabledLocales: LocaleCode[];
}
