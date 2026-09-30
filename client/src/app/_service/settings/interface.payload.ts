import type { LocaleCode } from '@/i18n/routing';
import type { LocalizedString } from '@/lib/i18n/types';
import type { ContactWayType } from '@/features/site/types';

export interface NavItemPayload {
  id?: string;
  label: LocalizedString;
  href: string;
  order: number;
  enabled: boolean;
}

export interface ContactWayPayload {
  id?: string;
  type: ContactWayType;
  icon: string;
  label: LocalizedString;
  value: string;
  description: LocalizedString;
  showInFooter: boolean;
  order: number;
}

export interface AdminSettingsBrandingUpdatePayload {
  siteName: LocalizedString;
  slogan: LocalizedString;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
}

export interface AdminSettingsNavigationUpdatePayload {
  navbar: NavItemPayload[];
  footer: { quickLinks: NavItemPayload[]; text: LocalizedString; copyright: LocalizedString };
}

export interface AdminSettingsContactUpdatePayload {
  contactWays: ContactWayPayload[];
}

export interface AdminSettingsSeoUpdatePayload {
  titleTemplate: LocalizedString;
  description: LocalizedString;
  ogImageUrl: string;
}

export interface AdminSettingsLocalesUpdatePayload {
  enabledLocales: LocaleCode[];
}
