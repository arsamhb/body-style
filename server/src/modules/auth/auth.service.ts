import { createHash, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../../config/env';
import { ApiError, ErrorCode } from '../../core/errors/ApiError';
import { AccessTokenClaims } from '../../core/middleware/requireAuth';
import { Admin, AdminDocument } from './auth.model';
import { RefreshToken } from './refreshToken.model';
import {
  ChangePasswordPayload,
  LoginPayload,
  LogoutPayload,
  RefreshPayload,
  SessionMeta,
} from './interface.payload';
import { TokenPairResponse } from './interface.response';

interface RefreshClaims {
  sub: string;
  jti: string;
  exp: number;
}

const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

const signAccessToken = (admin: AdminDocument): string => {
  const claims: AccessTokenClaims = {
    sub: String(admin._id),
    email: admin.email,
    role: admin.role,
    permissions: admin.role === 'developer' ? [] : admin.permissions,
  };
  // `as any` on expiresIn: @types/jsonwebtoken types it as a branded string literal;
  // a plain env string ('15m') is valid at runtime but not to the type checker.
  return jwt.sign(claims, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as any,
  });
};

const issueRefreshToken = async (
  admin: AdminDocument,
  meta: SessionMeta,
): Promise<string> => {
  const jti = randomUUID();
  const token = jwt.sign(
    { sub: String(admin._id), jti },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiresIn as any,
    },
  );
  const { exp } = jwt.decode(token) as RefreshClaims;
  await RefreshToken.create({
    admin: admin._id,
    tokenHash: hashToken(token),
    jti,
    expiresAt: new Date(exp * 1000),
    userAgent: meta.userAgent.slice(0, 512),
    ip: meta.ip.slice(0, 64),
  });
  return token;
};

const issueTokens = async (
  admin: AdminDocument,
  meta: SessionMeta,
): Promise<TokenPairResponse> => ({
  accessToken: signAccessToken(admin),
  refreshToken: await issueRefreshToken(admin, meta),
});

/** Hash a plaintext password (used by the seed script and user management). */
export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, config.bcryptSaltRounds);

/** Invalidates every session of an account (logout everywhere). */
export const revokeAllForAdmin = async (adminId: string): Promise<void> => {
  await RefreshToken.updateMany(
    { admin: adminId, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
};

export const login = async (
  { email, password }: LoginPayload,
  meta: SessionMeta,
): Promise<TokenPairResponse> => {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  // Same response for unknown email, wrong password and disabled account: no enumeration.
  if (!admin || !admin.isActive) throw ApiError.invalidCredentials();

  const matches = await bcrypt.compare(password, admin.passwordHash);
  if (!matches) throw ApiError.invalidCredentials();

  return issueTokens(admin, meta);
};

/**
 * Rotation: every refresh consumes the presented token and issues a new pair. Presenting an
 * already-consumed token means it leaked (or a client replayed it), so the whole account's
 * sessions are revoked.
 */
export const refresh = async (
  { refreshToken }: RefreshPayload,
  meta: SessionMeta,
): Promise<TokenPairResponse> => {
  let claims: RefreshClaims;
  try {
    claims = jwt.verify(
      refreshToken,
      config.jwt.refreshSecret,
    ) as RefreshClaims;
  } catch {
    throw ApiError.unauthorized(
      'Invalid or expired refresh token',
      ErrorCode.EXPIRED_TOKEN,
    );
  }

  const stored = await RefreshToken.findOne({
    tokenHash: hashToken(refreshToken),
  });
  if (!stored) {
    throw ApiError.unauthorized(
      'Unknown refresh token',
      ErrorCode.EXPIRED_TOKEN,
    );
  }
  if (stored.revokedAt) {
    await revokeAllForAdmin(String(stored.admin));
    throw ApiError.unauthorized(
      'Refresh token reuse detected',
      ErrorCode.EXPIRED_TOKEN,
    );
  }

  const admin = await Admin.findById(claims.sub);
  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized(
      'Account is not available',
      ErrorCode.NOT_AUTHENTICATED,
    );
  }

  const tokens = await issueTokens(admin, meta);
  const { jti: newJti } = jwt.decode(tokens.refreshToken) as RefreshClaims;
  stored.revokedAt = new Date();
  stored.replacedByJti = newJti;
  await stored.save();

  return tokens;
};

/** Idempotent: revoking an unknown or already-revoked token is not an error. */
export const logout = async ({
  refreshToken,
}: LogoutPayload): Promise<void> => {
  await RefreshToken.updateOne(
    { tokenHash: hashToken(refreshToken), revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
};

export const changePassword = async (
  adminId: string,
  { currentPassword, newPassword }: ChangePasswordPayload,
): Promise<void> => {
  const admin = await getAdminById(adminId);
  const matches = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!matches) {
    throw ApiError.validation([
      {
        field: 'currentPassword',
        code: 'invalid',
        message: 'Current password is incorrect',
      },
    ]);
  }
  admin.passwordHash = await hashPassword(newPassword);
  admin.passwordChangedAt = new Date();
  await admin.save();
  await revokeAllForAdmin(adminId);
};

export const getAdminById = async (id: string): Promise<AdminDocument> => {
  const admin = await Admin.findById(id);
  if (!admin) throw ApiError.notFound('Admin not found');
  return admin;
};
