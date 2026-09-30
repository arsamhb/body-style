import { Router } from 'express';
import { PermissionKey } from '../../core/auth/permissions';
import { asyncHandler } from '../../core/middleware/asyncHandler';
import { requireAuth } from '../../core/middleware/requireAuth';
import { requirePermission } from '../../core/middleware/requirePermission';
import { requireRole } from '../../core/middleware/requireRole';
import { validate } from '../../core/middleware/validate';
import * as controller from './pages.controller';
import {
  pageEnabledValidationSchema,
  pageSeoValidationSchema,
  sectionCreateValidationSchema,
  sectionsReorderValidationSchema,
  sectionUpdateValidationSchema,
} from './pages.validation';

/** `pages.<key>` lets an admin edit that page's content; structure changes are developer-only. */
const pagePermission = requirePermission(
  (req) => `pages.${req.params.key}` as PermissionKey,
);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get('/', asyncHandler(controller.list));
adminRouter.get('/:key', asyncHandler(controller.read));
adminRouter.patch(
  '/:key',
  pagePermission,
  validate(pageSeoValidationSchema),
  asyncHandler(controller.updateSeo),
);
adminRouter.patch(
  '/:key/enabled',
  requireRole('developer'),
  validate(pageEnabledValidationSchema),
  asyncHandler(controller.setEnabled),
);
adminRouter.post(
  '/:key/sections',
  requireRole('developer'),
  validate(sectionCreateValidationSchema),
  asyncHandler(controller.addSection),
);
adminRouter.patch(
  '/:key/sections/reorder',
  pagePermission,
  validate(sectionsReorderValidationSchema),
  asyncHandler(controller.reorderSections),
);
adminRouter.patch(
  '/:key/sections/:sectionId',
  pagePermission,
  validate(sectionUpdateValidationSchema),
  asyncHandler(controller.updateSection),
);
adminRouter.delete(
  '/:key/sections/:sectionId',
  requireRole('developer'),
  asyncHandler(controller.removeSection),
);

const publicRouter = Router();
publicRouter.get('/:key', asyncHandler(controller.readPublic));

export { adminRouter as pagesAdminRoutes, publicRouter as pagesPublicRoutes };
