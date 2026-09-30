import type { LocaleCode } from '@/i18n/routing';
import type { LocalizedString } from '@/lib/i18n/types';
import type { ContactWayType } from '@/features/site/types';

export interface NavItemSchema {
  id: string;
  label: LocalizedString;
  href: string;
  order: number;
  enabled: boolean;
}

export interface ContactWaySchema {
  id: string;
  type: ContactWayType;
  icon: string;
  label: LocalizedString;
  value: string;
  description: LocalizedString;
  showInFooter: boolean;
  order: number;
}

export interface SettingsSchema {
  siteName: LocalizedString;
  slogan: LocalizedString;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  defaultLocale: LocaleCode;
  enabledLocales: LocaleCode[];
  supportedLocales: LocaleCode[];
  navbar: NavItemSchema[];
  footer: { quickLinks: NavItemSchema[]; text: LocalizedString; copyright: LocalizedString };
  contactWays: ContactWaySchema[];
  seo: { titleTemplate: LocalizedString; description: LocalizedString; ogImageUrl: string };
  updatedAt: Date;
}
