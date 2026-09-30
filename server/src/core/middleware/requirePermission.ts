import { Request, RequestHandler } from 'express';
import { ApiError } from '../errors/ApiError';
import { hasPermission, PermissionKey } from '../auth/permissions';

type PermissionResolver = (req: Request) => PermissionKey;

/**
 * Use after `requireAuth`. Developers always pass; admins need the key in their permission list.
 * Accepts a static key or a resolver for route-dependent keys, e.g.
 *   requirePermission((req) => `pages.${req.params.key}` as PermissionKey)
 */
export const requirePermission =
  (keyOrResolver: PermissionKey | PermissionResolver): RequestHandler =>
  (req, _res, next) => {
    if (!req.admin) {
      next(ApiError.unauthorized());
      return;
    }
    const key =
      typeof keyOrResolver === 'function' ? keyOrResolver(req) : keyOrResolver;
    if (!hasPermission(req.admin, key)) {
      next(ApiError.forbidden(`Missing permission: ${key}`));
      return;
    }
    next();
  };
