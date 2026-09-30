import type { LocaleCode } from '@/i18n/routing';
import type { LocalizedString } from '@/lib/i18n/types';
import type { ContactWayType } from '@/features/site/types';

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

export interface AdminSettingsReadResponse {
  siteName: LocalizedString;
  slogan: LocalizedString;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  defaultLocale: LocaleCode;
  enabledLocales: LocaleCode[];
  supportedLocales: LocaleCode[];
  navbar: NavItemAdminResponse[];
  footer: { quickLinks: NavItemAdminResponse[]; text: LocalizedString; copyright: LocalizedString };
  contactWays: ContactWayAdminResponse[];
  seo: { titleTemplate: LocalizedString; description: LocalizedString; ogImageUrl: string };
  updatedAt: string;
}
