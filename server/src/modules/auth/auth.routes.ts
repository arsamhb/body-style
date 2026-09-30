import { Router } from 'express';
import { validate } from '../../core/middleware/validate';
import { requireAuth } from '../../core/middleware/requireAuth';
import { asyncHandler } from '../../core/middleware/asyncHandler';
import { loginLimiter, refreshLimiter } from '../../core/middleware/rateLimit';
import * as controller from './auth.controller';
import {
  changePasswordValidationSchema,
  loginValidationSchema,
  logoutValidationSchema,
  refreshValidationSchema,
} from './auth.validation';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validate(loginValidationSchema),
  asyncHandler(controller.login),
);
router.post(
  '/refresh',
  refreshLimiter,
  validate(refreshValidationSchema),
  asyncHandler(controller.refresh),
);
router.post(
  '/logout',
  validate(logoutValidationSchema),
  asyncHandler(controller.logout),
);
router.get('/me', requireAuth, asyncHandler(controller.me));
router.post(
  '/password',
  requireAuth,
  validate(changePasswordValidationSchema),
  asyncHandler(controller.changePassword),
);

export default router;
