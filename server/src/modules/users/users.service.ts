import { isValidObjectId } from 'mongoose';
import { ApiError } from '../../core/errors/ApiError';
import { normalizePermissions } from '../../core/auth/permissions';
import { PaginationParams } from '../../core/pagination';
import { Admin, AdminDocument } from '../auth/auth.model';
import { hashPassword, revokeAllForAdmin } from '../auth/auth.service';
import { UserCreatePayload, UserUpdatePayload } from './interface.payload';

const findByIdOrThrow = async (id: string): Promise<AdminDocument> => {
  if (!isValidObjectId(id)) throw ApiError.notFound('User not found');
  const user = await Admin.findById(id);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

/** The system must always keep at least one active developer who can log in. */
const assertNotLastDeveloper = async (
  user: AdminDocument,
  message: string,
): Promise<void> => {
  if (user.role !== 'developer' || !user.isActive) return;
  const others = await Admin.countDocuments({
    _id: { $ne: user._id },
    role: 'developer',
    isActive: true,
  });
  if (others === 0) throw ApiError.conflict(message);
};

export const listUsers = () => Admin.find().sort({ createdAt: -1 }).exec();

export const listUsersPaginated = async ({
  limit,
  offset,
}: PaginationParams) => {
  const [items, total] = await Promise.all([
    Admin.find().sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
    Admin.countDocuments().exec(),
  ]);
  return { items, total };
};

export const getUser = (id: string) => findByIdOrThrow(id);

export const createUser = async (
  payload: UserCreatePayload,
): Promise<AdminDocument> => {
  const role = payload.role ?? 'admin';
  return Admin.create({
    email: payload.email.toLowerCase(),
    passwordHash: await hashPassword(payload.password),
    displayName: payload.displayName ?? '',
    role,
    permissions: normalizePermissions(payload.permissions, role),
    isActive: true,
  });
};

export const updateUser = async (
  id: string,
  payload: UserUpdatePayload,
  actorId: string,
): Promise<AdminDocument> => {
  const user = await findByIdOrThrow(id);
  const isSelf = String(user._id) === actorId;

  if (
    isSelf &&
    (payload.role !== undefined || payload.isActive !== undefined)
  ) {
    throw ApiError.conflict('You cannot change your own role or active state');
  }

  const demoting = payload.role !== undefined && payload.role !== 'developer';
  const deactivating = payload.isActive === false;
  if (demoting || deactivating) {
    await assertNotLastDeveloper(
      user,
      'The last active developer cannot be demoted or deactivated',
    );
  }

  if (payload.email !== undefined) user.email = payload.email.toLowerCase();
  if (payload.displayName !== undefined) user.displayName = payload.displayName;
  if (payload.role !== undefined) user.role = payload.role;
  if (payload.isActive !== undefined) user.isActive = payload.isActive;
  if (payload.permissions !== undefined || payload.role !== undefined) {
    user.permissions = normalizePermissions(
      payload.permissions ?? user.permissions,
      user.role,
    );
  }
  if (payload.password !== undefined) {
    user.passwordHash = await hashPassword(payload.password);
    user.passwordChangedAt = new Date();
  }
  await user.save();

  if (payload.password !== undefined || deactivating || demoting) {
    await revokeAllForAdmin(String(user._id));
  }
  return user;
};

export const deleteUser = async (
  id: string,
  actorId: string,
): Promise<void> => {
  const user = await findByIdOrThrow(id);
  if (String(user._id) === actorId)
    throw ApiError.conflict('You cannot delete your own account');
  await assertNotLastDeveloper(
    user,
    'The last active developer cannot be deleted',
  );
  await revokeAllForAdmin(String(user._id));
  await user.deleteOne();
};
