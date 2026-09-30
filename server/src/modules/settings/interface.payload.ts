import { LocalizedString } from '../../core/i18n/types';
import { ContactWayType } from './settings.model';

export interface NavItemPayload {
  id?: string;
  label: LocalizedString;
  href: string;
  order?: number;
  enabled?: boolean;
}

export interface ContactWayPayload {
  id?: string;
  type: ContactWayType;
  icon?: string;
  label: LocalizedString;
  value: string;
  description?: LocalizedString;
  showInFooter?: boolean;
  order?: number;
}

export interface SettingsBrandingUpdatePayload {
  siteName?: LocalizedString;
  slogan?: LocalizedString;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
}

export interface SettingsNavigationUpdatePayload {
  navbar?: NavItemPayload[];
  footer?: {
    quickLinks?: NavItemPayload[];
    text?: LocalizedString;
    copyright?: LocalizedString;
  };
}

export interface SettingsContactUpdatePayload {
  contactWays: ContactWayPayload[];
}

export interface SettingsSeoUpdatePayload {
  titleTemplate?: LocalizedString;
  description?: LocalizedString;
  ogImageUrl?: string;
}

export interface SettingsLocalesUpdatePayload {
  enabledLocales: string[];
}
