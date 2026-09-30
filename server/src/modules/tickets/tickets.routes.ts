import { Router } from 'express';
import { asyncHandler } from '../../core/middleware/asyncHandler';
import { ticketLimiter, tokenLimiter } from '../../core/middleware/rateLimit';
import { requireAuth } from '../../core/middleware/requireAuth';
import { requirePermission } from '../../core/middleware/requirePermission';
import { validate } from '../../core/middleware/validate';
import * as c from './tickets.controller';
import {
  ticketCreateValidationSchema,
  ticketUpdateValidationSchema,
} from './tickets.validation';

/** /public/tickets — token issuance + submission, both rate limited per IP. */
const pub = Router();
pub.get('/token', tokenLimiter, c.token);
pub.post(
  '/',
  ticketLimiter,
  validate(ticketCreateValidationSchema),
  asyncHandler(c.create),
);

/** /admin/tickets — inbox (tickets.read) and triage (tickets.write). */
const admin = Router();
admin.use(requireAuth);
admin.get('/', requirePermission('tickets.read'), asyncHandler(c.list));
admin.get('/:id', requirePermission('tickets.read'), asyncHandler(c.read));
admin.patch(
  '/:id',
  requirePermission('tickets.write'),
  validate(ticketUpdateValidationSchema),
  asyncHandler(c.update),
);
admin.delete(
  '/:id',
  requirePermission('tickets.write'),
  asyncHandler(c.remove),
);

/** /admin/dashboard — counts for the panel home; any signed-in account. */
const dashboard = Router();
dashboard.get('/', requireAuth, asyncHandler(c.dashboard));

export {
  admin as ticketsAdminRoutes,
  pub as ticketsPublicRoutes,
  dashboard as dashboardRoutes,
};
