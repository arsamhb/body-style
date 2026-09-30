/**
 * Two-tier back office.
 *  - `developer`: the agency/owner account. Bypasses every permission check and is the only role
 *    allowed to change structure (locales, pages, sections, catalog types, users).
 *  - `admin`: the client. Sees and edits only what its `permissions` list grants.
 *
 * The same list is mirrored on the client in `client/src/lib/auth/permissions.ts`.
 */
export const ADMIN_ROLES = ['developer', 'admin'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const PERMISSIONS = [
  'settings.branding',
  'settings.navigation',
  'settings.contact',
  'settings.seo',
  'pages.landing',
  'pages.about',
  'pages.contact',
  'pages.catalog',
  'catalog.items',
  'catalog.categories',
  'tickets.read',
  'tickets.write',
  'media',
] as const;
export type PermissionKey = (typeof PERMISSIONS)[number];

/** Granting the key implies the listed keys. */
const IMPLIES: Partial<Record<PermissionKey, PermissionKey[]>> = {
  'tickets.write': ['tickets.read'],
};

export interface PermissionSubject {
  role: string;
  permissions: readonly string[];
}

export const isPermissionKey = (value: unknown): value is PermissionKey =>
  typeof value === 'string' &&
  (PERMISSIONS as readonly string[]).includes(value);

export const isDeveloper = (
  subject: Pick<PermissionSubject, 'role'>,
): boolean => subject.role === 'developer';

export const hasPermission = (
  subject: PermissionSubject,
  key: PermissionKey,
): boolean => {
  if (isDeveloper(subject)) return true;
  if (subject.permissions.includes(key)) return true;
  return (Object.entries(IMPLIES) as [PermissionKey, PermissionKey[]][]).some(
    ([granted, implied]) =>
      subject.permissions.includes(granted) && implied.includes(key),
  );
};

/** Drops unknown/duplicate keys. Developers never store permissions (they have all). */
export const normalizePermissions = (
  permissions: readonly unknown[] | undefined,
  role: string,
): PermissionKey[] => {
  if (role === 'developer' || !permissions) return [];
  return [...new Set(permissions.filter(isPermissionKey))];
};
