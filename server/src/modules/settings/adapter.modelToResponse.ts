import {
  defaultLocale,
  mapToObject,
  resolveLocalized,
} from '../../core/i18n/localized';
import {
  LocaleCode,
  SUPPORTED_LOCALES,
  isLocaleCode,
} from '../../core/i18n/types';
import {
  ContactWayAdminResponse,
  ContactWayPublicResponse,
  NavItemAdminResponse,
  NavItemPublicResponse,
  SettingsAdminReadResponse,
  SitePublicReadResponse,
} from './interface.response';
import { ContactWaySub, NavItemSub, SettingsDocument } from './settings.model';

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

const navItemAdmin = (item: NavItemSub): NavItemAdminResponse => ({
  id: item.id,
  label: mapToObject(item.label),
  href: item.href,
  order: item.order,
  enabled: item.enabled,
});

const contactWayAdmin = (way: ContactWaySub): ContactWayAdminResponse => ({
  id: way.id,
  type: way.type,
  icon: way.icon,
  label: mapToObject(way.label),
  value: way.value,
  description: mapToObject(way.description),
  showInFooter: way.showInFooter,
  order: way.order,
});

export const enabledLocalesOf = (settings: SettingsDocument): LocaleCode[] => {
  const list = settings.enabledLocales.filter(isLocaleCode);
  return list.includes(defaultLocale()) ? list : [defaultLocale(), ...list];
};

export const settingsModel2SettingsAdminReadResponse = (
  settings: SettingsDocument,
): SettingsAdminReadResponse => ({
  siteName: mapToObject(settings.siteName),
  slogan: mapToObject(settings.slogan),
  logoUrl: settings.logoUrl,
  logoDarkUrl: settings.logoDarkUrl,
  faviconUrl: settings.faviconUrl,
  defaultLocale: defaultLocale(),
  enabledLocales: enabledLocalesOf(settings),
  supportedLocales: [...SUPPORTED_LOCALES],
  navbar: [...settings.navbar].sort(byOrder).map(navItemAdmin),
  footer: {
    quickLinks: [...settings.footer.quickLinks].sort(byOrder).map(navItemAdmin),
    text: mapToObject(settings.footer.text),
    copyright: mapToObject(settings.footer.copyright),
  },
  contactWays: [...settings.contactWays].sort(byOrder).map(contactWayAdmin),
  seo: {
    titleTemplate: mapToObject(settings.seo.titleTemplate),
    description: mapToObject(settings.seo.description),
    ogImageUrl: settings.seo.ogImageUrl,
  },
  updatedAt: settings.updatedAt.toISOString(),
});

const navItemPublic = (
  item: NavItemSub,
  locale: LocaleCode,
): NavItemPublicResponse => ({
  id: item.id,
  label: resolveLocalized(item.label, locale),
  href: item.href,
});

const contactWayPublic = (
  way: ContactWaySub,
  locale: LocaleCode,
): ContactWayPublicResponse => ({
  id: way.id,
  type: way.type,
  icon: way.icon,
  label: resolveLocalized(way.label, locale),
  value: way.value,
  description: resolveLocalized(way.description, locale),
  showInFooter: way.showInFooter,
});

export const settingsModel2SitePublicReadResponse = (
  settings: SettingsDocument,
  locale: LocaleCode,
  enabledPages: string[],
): SitePublicReadResponse => ({
  siteName: resolveLocalized(settings.siteName, locale),
  slogan: resolveLocalized(settings.slogan, locale),
  logoUrl: settings.logoUrl || undefined,
  logoDarkUrl: settings.logoDarkUrl || undefined,
  faviconUrl: settings.faviconUrl || undefined,
  defaultLocale: defaultLocale(),
  enabledLocales: enabledLocalesOf(settings),
  navbar: [...settings.navbar]
    .filter((i) => i.enabled)
    .sort(byOrder)
    .map((i) => navItemPublic(i, locale)),
  footer: {
    quickLinks: [...settings.footer.quickLinks]
      .filter((i) => i.enabled)
      .sort(byOrder)
      .map((i) => navItemPublic(i, locale)),
    text: resolveLocalized(settings.footer.text, locale),
    copyright: resolveLocalized(settings.footer.copyright, locale),
  },
  contactWays: [...settings.contactWays]
    .sort(byOrder)
    .map((w) => contactWayPublic(w, locale)),
  seo: {
    titleTemplate: resolveLocalized(settings.seo.titleTemplate, locale),
    description: resolveLocalized(settings.seo.description, locale),
    ogImageUrl: settings.seo.ogImageUrl || undefined,
  },
  enabledPages,
});
