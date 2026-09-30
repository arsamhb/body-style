import { RequestHandler } from 'express';
import { ApiError } from '../errors/ApiError';
import { AdminRole } from '../auth/permissions';

/** Use after `requireAuth`. Allows only the listed roles (e.g. `requireRole('developer')`). */
export const requireRole =
  (...roles: AdminRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.admin) {
      next(ApiError.unauthorized());
      return;
    }
    if (!roles.includes(req.admin.role as AdminRole)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
