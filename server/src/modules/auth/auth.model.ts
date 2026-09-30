import { Schema, model, Document } from 'mongoose';
import {
  ADMIN_ROLES,
  AdminRole,
  PERMISSIONS,
  PermissionKey,
} from '../../core/auth/permissions';

export type { AdminRole };

export interface AdminDocument extends Document {
  email: string;
  passwordHash: string;
  displayName: string;
  role: AdminRole;
  permissions: PermissionKey[];
  isActive: boolean;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    displayName: { type: String, trim: true, maxlength: 80, default: '' },
    role: { type: String, enum: ADMIN_ROLES, default: 'admin' },
    permissions: { type: [{ type: String, enum: PERMISSIONS }], default: [] },
    isActive: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
);

/** Back-office accounts (both developer and admin roles). Model name kept for backwards compat. */
export const Admin = model<AdminDocument>('Admin', adminSchema);
