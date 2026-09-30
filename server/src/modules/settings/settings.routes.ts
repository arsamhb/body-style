import { Router } from 'express';
import { asyncHandler } from '../../core/middleware/asyncHandler';
import { requireAuth } from '../../core/middleware/requireAuth';
import { requirePermission } from '../../core/middleware/requirePermission';
import { requireRole } from '../../core/middleware/requireRole';
import { validate } from '../../core/middleware/validate';
import * as controller from './settings.controller';
import {
  settingsBrandingValidationSchema,
  settingsContactValidationSchema,
  settingsLocalesValidationSchema,
  settingsNavigationValidationSchema,
  settingsSeoValidationSchema,
} from './settings.validation';

/** /admin/settings — each section has its own permission; locales are developer-only. */
const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get('/', asyncHandler(controller.read));
adminRouter.patch(
  '/branding',
  requirePermission('settings.branding'),
  validate(settingsBrandingValidationSchema),
  asyncHandler(controller.updateBranding),
);
adminRouter.patch(
  '/navigation',
  requirePermission('settings.navigation'),
  validate(settingsNavigationValidationSchema),
  asyncHandler(controller.updateNavigation),
);
adminRouter.patch(
  '/contact',
  requirePermission('settings.contact'),
  validate(settingsContactValidationSchema),
  asyncHandler(controller.updateContact),
);
adminRouter.patch(
  '/seo',
  requirePermission('settings.seo'),
  validate(settingsSeoValidationSchema),
  asyncHandler(controller.updateSeo),
);
adminRouter.patch(
  '/locales',
  requireRole('developer'),
  validate(settingsLocalesValidationSchema),
  asyncHandler(controller.updateLocales),
);

/** /public/site — resolved, unauthenticated. */
const publicRouter = Router();
publicRouter.get('/', asyncHandler(controller.readPublicSite));

export { adminRouter as settingsAdminRoutes, publicRouter as sitePublicRoutes };
