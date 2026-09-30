import 'express';
import type { PermissionKey } from '../core/auth/permissions';

declare global {
  namespace Express {
    interface Request {
      /** Set by requireAuth after a valid access token. */
      admin?: {
        id: string;
        email: string;
        role: string;
        permissions: PermissionKey[];
      };
    }
  }
}
