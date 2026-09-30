import { Router } from 'express';
import { asyncHandler } from '../../core/middleware/asyncHandler';
import { requireAuth } from '../../core/middleware/requireAuth';
import { requirePermission } from '../../core/middleware/requirePermission';
import { validate } from '../../core/middleware/validate';
import * as controller from './media.controller';
import { imageUpload } from './media.upload';
import { mediaAltValidationSchema } from './media.validation';

/**
 * Browsing the library needs only a session (every content editor picks images);
 * uploading and deleting need the `media` permission.
 */
const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.read));
router.post(
  '/',
  requirePermission('media'),
  imageUpload.single('file'),
  asyncHandler(controller.upload),
);
router.patch(
  '/:id',
  requirePermission('media'),
  validate(mediaAltValidationSchema),
  asyncHandler(controller.updateAlt),
);
router.delete(
  '/:id',
  requirePermission('media'),
  asyncHandler(controller.remove),
);

export default router;
