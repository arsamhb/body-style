import { Schema, model, Document, Types } from 'mongoose';

/**
 * One row per issued refresh token. Storing a hash (never the token) lets us:
 *  - rotate on every refresh and detect reuse of an old token (→ revoke the whole family),
 *  - log out (revoke) and force-logout on password change / deactivation,
 *  - expire rows automatically via the TTL index.
 */
export interface RefreshTokenDocument extends Document {
  admin: Types.ObjectId;
  tokenHash: string;
  jti: string;
  expiresAt: Date;
  revokedAt?: Date;
  replacedByJti?: string;
  userAgent: string;
  ip: string;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    jti: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    replacedByJti: { type: String },
    userAgent: { type: String, default: '', maxlength: 512 },
    ip: { type: String, default: '', maxlength: 64 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model<RefreshTokenDocument>(
  'RefreshToken',
  refreshTokenSchema,
);
