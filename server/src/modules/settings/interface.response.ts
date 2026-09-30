import { LocaleCode, LocalizedString } from '../../core/i18n/types';
import { ContactWayType } from './settings.model';

/** Full maps — what the admin panel edits. */
export interface NavItemAdminResponse {
  id: string;
  label: LocalizedString;
  href: string;
  order: number;
  enabled: boolean;
}

export interface ContactWayAdminResponse {
  id: string;
  type: ContactWayType;
  icon: string;
  label: LocalizedString;
  value: string;
  description: LocalizedString;
  showInFooter: boolean;
  order: number;
}

export interface SettingsAdminReadResponse {
  siteName: LocalizedString;
  slogan: LocalizedString;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  defaultLocale: LocaleCode;
  enabledLocales: LocaleCode[];
  supportedLocales: LocaleCode[];
  navbar: NavItemAdminResponse[];
  footer: {
    quickLinks: NavItemAdminResponse[];
    text: LocalizedString;
    copyright: LocalizedString;
  };
  contactWays: ContactWayAdminResponse[];
  seo: {
    titleTemplate: LocalizedString;
    description: LocalizedString;
    ogImageUrl: string;
  };
  updatedAt: string;
}

/** Resolved strings — what the public site renders. */
export interface NavItemPublicResponse {
  id: string;
  label: string;
  href: string;
}

export interface ContactWayPublicResponse {
  id: string;
  type: ContactWayType;
  icon: string;
  label: string;
  value: string;
  description: string;
  showInFooter: boolean;
}

export interface SitePublicReadResponse {
  siteName: string;
  slogan: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  defaultLocale: LocaleCode;
  enabledLocales: LocaleCode[];
  navbar: NavItemPublicResponse[];
  footer: {
    quickLinks: NavItemPublicResponse[];
    text: string;
    copyright: string;
  };
  contactWays: ContactWayPublicResponse[];
  seo: { titleTemplate: string; description: string; ogImageUrl?: string };
  enabledPages: string[];
}
