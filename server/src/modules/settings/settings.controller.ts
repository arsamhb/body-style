import { RequestHandler } from 'express';
import { localeFromRequest } from '../../core/locale';
import * as settingsService from './settings.service';
import {
  settingsModel2SettingsAdminReadResponse,
  settingsModel2SitePublicReadResponse,
} from './adapter.modelToResponse';

/** Page keys are wired in the pages module (Phase 4); until then every page is enabled. */
let enabledPagesProvider: () => Promise<string[]> = async () => [
  'landing',
  'about',
  'contact',
  'catalog',
];
export const setEnabledPagesProvider = (fn: () => Promise<string[]>) => {
  enabledPagesProvider = fn;
};

export const read: RequestHandler = async (_req, res) => {
  const settings = await settingsService.getSettings();
  res.json(settingsModel2SettingsAdminReadResponse(settings));
};

const respond = (
  res: Parameters<RequestHandler>[1],
  doc: Awaited<ReturnType<typeof settingsService.getSettings>>,
) => res.json(settingsModel2SettingsAdminReadResponse(doc));

export const updateBranding: RequestHandler = async (req, res) => {
  respond(res, await settingsService.updateBranding(req.body));
};
export const updateNavigation: RequestHandler = async (req, res) => {
  respond(res, await settingsService.updateNavigation(req.body));
};
export const updateContact: RequestHandler = async (req, res) => {
  respond(res, await settingsService.updateContact(req.body));
};
export const updateSeo: RequestHandler = async (req, res) => {
  respond(res, await settingsService.updateSeo(req.body));
};
export const updateLocales: RequestHandler = async (req, res) => {
  respond(res, await settingsService.updateLocales(req.body));
};

export const readPublicSite: RequestHandler = async (req, res) => {
  const locale = localeFromRequest(req);
  const [settings, enabledPages] = await Promise.all([
    settingsService.getSettings(),
    enabledPagesProvider(),
  ]);
  res.setHeader(
    'Cache-Control',
    'public, max-age=60, stale-while-revalidate=300',
  );
  res.json(
    settingsModel2SitePublicReadResponse(settings, locale, enabledPages),
  );
};
