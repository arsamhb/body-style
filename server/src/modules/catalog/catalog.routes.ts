import { Router } from 'express';
import { asyncHandler } from '../../core/middleware/asyncHandler';
import { requireAuth } from '../../core/middleware/requireAuth';
import { requirePermission } from '../../core/middleware/requirePermission';
import { requireRole } from '../../core/middleware/requireRole';
import { validate } from '../../core/middleware/validate';
import * as c from './catalog.controller';
import {
  catalogCategoryCreateValidationSchema,
  catalogCategoryUpdateValidationSchema,
  catalogItemCreateValidationSchema,
  catalogItemStatusValidationSchema,
  catalogItemUpdateValidationSchema,
  catalogTypeCreateValidationSchema,
  catalogTypeUpdateValidationSchema,
} from './catalog.validation';

/**
 * /admin/catalog
 *   types/*       developer only (structure: specs, card design, filters)
 *   categories/*  permission catalog.categories (reading is open to any session)
 *   items/*       permission catalog.items      (reading is open to any session)
 */
const admin = Router();
admin.use(requireAuth);

admin.get('/types', asyncHandler(c.listTypes));
admin.get('/types/:id', asyncHandler(c.readType));
admin.post(
  '/types',
  requireRole('developer'),
  validate(catalogTypeCreateValidationSchema),
  asyncHandler(c.createType),
);
admin.patch(
  '/types/:id',
  requireRole('developer'),
  validate(catalogTypeUpdateValidationSchema),
  asyncHandler(c.updateType),
);
admin.delete(
  '/types/:id',
  requireRole('developer'),
  asyncHandler(c.removeType),
);

admin.get('/categories', asyncHandler(c.listCategories));
admin.post(
  '/categories',
  requirePermission('catalog.categories'),
  validate(catalogCategoryCreateValidationSchema),
  asyncHandler(c.createCategory),
);
admin.patch(
  '/categories/:id',
  requirePermission('catalog.categories'),
  validate(catalogCategoryUpdateValidationSchema),
  asyncHandler(c.updateCategory),
);
admin.delete(
  '/categories/:id',
  requirePermission('catalog.categories'),
  asyncHandler(c.removeCategory),
);

admin.get('/items', asyncHandler(c.listItems));
admin.get('/items/:id', asyncHandler(c.readItem));
admin.post(
  '/items',
  requirePermission('catalog.items'),
  validate(catalogItemCreateValidationSchema),
  asyncHandler(c.createItem),
);
admin.patch(
  '/items/:id/status',
  requirePermission('catalog.items'),
  validate(catalogItemStatusValidationSchema),
  asyncHandler(c.updateItemStatus),
);
admin.patch(
  '/items/:id',
  requirePermission('catalog.items'),
  validate(catalogItemUpdateValidationSchema),
  asyncHandler(c.updateItem),
);
admin.delete(
  '/items/:id',
  requirePermission('catalog.items'),
  asyncHandler(c.removeItem),
);

/** /public/catalog — enabled types, published items, locale-resolved. */
const pub = Router();
pub.get('/types', asyncHandler(c.publicListTypes));
pub.get('/types/:typeSlug', asyncHandler(c.publicReadType));
pub.get('/types/:typeSlug/items', asyncHandler(c.publicListItems));
pub.get('/types/:typeSlug/items/:itemSlug', asyncHandler(c.publicReadItem));

export { admin as catalogAdminRoutes, pub as catalogPublicRoutes };
