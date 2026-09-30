import { randomUUID } from 'node:crypto';
import { ApiError } from '../../core/errors/ApiError';
import { cleanLocalized, defaultLocale } from '../../core/i18n/localized';
import { LocalizedString } from '../../core/i18n/types';
import { triggerRevalidate } from '../../core/revalidate';
import {
  ContactWayPayload,
  NavItemPayload,
  SettingsBrandingUpdatePayload,
  SettingsContactUpdatePayload,
  SettingsLocalesUpdatePayload,
  SettingsNavigationUpdatePayload,
  SettingsSeoUpdatePayload,
} from './interface.payload';
import { Settings, SettingsDocument } from './settings.model';

let cache: SettingsDocument | null = null;

const toMap = (value: LocalizedString | undefined) =>
  new Map(Object.entries(cleanLocalized(value)));

const normalizeNavItems = (items: NavItemPayload[] | undefined) =>
  (items ?? []).map((item, index) => ({
    id: item.id || randomUUID(),
    label: toMap(item.label),
    href: item.href,
    order: item.order ?? index,
    enabled: item.enabled ?? true,
  }));

const normalizeContactWays = (items: ContactWayPayload[]) =>
  items.map((way, index) => ({
    id: way.id || randomUUID(),
    type: way.type,
    icon: way.icon || '',
    label: toMap(way.label),
    value: way.value,
    description: toMap(way.description),
    showInFooter: way.showInFooter ?? true,
    order: way.order ?? index,
  }));

/** Returns the singleton, creating an empty one on first use. Cached in memory per process. */
export const getSettings = async (): Promise<SettingsDocument> => {
  if (cache) return cache;
  const doc = await Settings.findOneAndUpdate(
    { key: 'site' },
    { $setOnInsert: { key: 'site', enabledLocales: [defaultLocale()] } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  cache = doc;
  return doc;
};

const persist = async (doc: SettingsDocument): Promise<SettingsDocument> => {
  await doc.save();
  cache = doc;
  triggerRevalidate(['settings']);
  return doc;
};

export const invalidateSettingsCache = () => {
  cache = null;
};

export const updateBranding = async (
  payload: SettingsBrandingUpdatePayload,
) => {
  const doc = await getSettings();
  if (payload.siteName !== undefined) doc.siteName = toMap(payload.siteName);
  if (payload.slogan !== undefined) doc.slogan = toMap(payload.slogan);
  if (payload.logoUrl !== undefined) doc.logoUrl = payload.logoUrl;
  if (payload.logoDarkUrl !== undefined) doc.logoDarkUrl = payload.logoDarkUrl;
  if (payload.faviconUrl !== undefined) doc.faviconUrl = payload.faviconUrl;
  return persist(doc);
};

export const updateNavigation = async (
  payload: SettingsNavigationUpdatePayload,
) => {
  const doc = await getSettings();
  if (payload.navbar !== undefined)
    doc.navbar = normalizeNavItems(payload.navbar) as never;
  if (payload.footer) {
    if (payload.footer.quickLinks !== undefined) {
      doc.footer.quickLinks = normalizeNavItems(
        payload.footer.quickLinks,
      ) as never;
    }
    if (payload.footer.text !== undefined)
      doc.footer.text = toMap(payload.footer.text);
    if (payload.footer.copyright !== undefined)
      doc.footer.copyright = toMap(payload.footer.copyright);
  }
  doc.markModified('navbar');
  doc.markModified('footer');
  return persist(doc);
};

export const updateContact = async (payload: SettingsContactUpdatePayload) => {
  const doc = await getSettings();
  doc.contactWays = normalizeContactWays(payload.contactWays) as never;
  doc.markModified('contactWays');
  return persist(doc);
};

export const updateSeo = async (payload: SettingsSeoUpdatePayload) => {
  const doc = await getSettings();
  if (payload.titleTemplate !== undefined)
    doc.seo.titleTemplate = toMap(payload.titleTemplate);
  if (payload.description !== undefined)
    doc.seo.description = toMap(payload.description);
  if (payload.ogImageUrl !== undefined) doc.seo.ogImageUrl = payload.ogImageUrl;
  doc.markModified('seo');
  return persist(doc);
};

export const updateLocales = async (payload: SettingsLocalesUpdatePayload) => {
  const doc = await getSettings();
  const list = [...new Set(payload.enabledLocales)];
  if (!list.includes(defaultLocale())) {
    throw ApiError.validation([
      {
        field: 'enabledLocales',
        code: 'default',
        message: `The default locale (${defaultLocale()}) must stay enabled`,
      },
    ]);
  }
  doc.enabledLocales = list;
  return persist(doc);
};
