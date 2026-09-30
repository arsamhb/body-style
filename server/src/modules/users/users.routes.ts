import { Router } from 'express';
import { asyncHandler } from '../../core/middleware/asyncHandler';
import { requireAuth } from '../../core/middleware/requireAuth';
import { requireRole } from '../../core/middleware/requireRole';
import { validate } from '../../core/middleware/validate';
import * as controller from './users.controller';
import {
  userCreateValidationSchema,
  userUpdateValidationSchema,
} from './users.validation';

/** Back-office accounts. Developer-only: admins never see other accounts. */
const router = Router();

router.use(requireAuth, requireRole('developer'));

router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.read));
router.post(
  '/',
  validate(userCreateValidationSchema),
  asyncHandler(controller.create),
);
router.patch(
  '/:id',
  validate(userUpdateValidationSchema),
  asyncHandler(controller.update),
);
router.delete('/:id', asyncHandler(controller.remove));

export default router;
