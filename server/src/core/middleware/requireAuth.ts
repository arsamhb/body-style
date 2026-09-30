import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { ApiError, ErrorCode } from '../errors/ApiError';
import { PermissionKey } from '../auth/permissions';

export interface AccessTokenClaims {
  sub: string;
  email: string;
  role: string;
  permissions: PermissionKey[];
}

/**
 * Verifies the `Authorization: Bearer <accessToken>` header and attaches `req.admin`.
 * Emits 401 EXPIRED_TOKEN / NOT_AUTHENTICATED so the frontend's refresh-or-logout flow kicks in.
 * Claims are trusted for the access-token lifetime (15 min by default); deactivating a user or
 * changing their permissions takes effect on the next refresh.
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(
      ApiError.unauthorized(
        'Authentication required',
        ErrorCode.NOT_AUTHENTICATED,
      ),
    );
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  try {
    const claims = jwt.verify(
      token,
      config.jwt.accessSecret,
    ) as AccessTokenClaims;
    req.admin = {
      id: claims.sub,
      email: claims.email,
      role: claims.role,
      permissions: Array.isArray(claims.permissions) ? claims.permissions : [],
    };
    next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      next(
        ApiError.unauthorized('Access token expired', ErrorCode.EXPIRED_TOKEN),
      );
      return;
    }
    next(
      ApiError.unauthorized(
        'Invalid access token',
        ErrorCode.NOT_AUTHENTICATED,
      ),
    );
  }
};
