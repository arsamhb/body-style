/** Mirror of `server/src/core/auth/permissions.ts`. Keep the two lists identical. */
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

/** Grouping used by the permission matrix in the users screen. */
export const PERMISSION_GROUPS: { key: string; permissions: PermissionKey[] }[] = [
  {
    key: 'settings',
    permissions: ['settings.branding', 'settings.navigation', 'settings.contact', 'settings.seo'],
  },
  { key: 'pages', permissions: ['pages.landing', 'pages.about', 'pages.contact', 'pages.catalog'] },
  { key: 'catalog', permissions: ['catalog.items', 'catalog.categories'] },
  { key: 'tickets', permissions: ['tickets.read', 'tickets.write'] },
  { key: 'media', permissions: ['media'] },
];

const IMPLIES: Partial<Record<PermissionKey, PermissionKey[]>> = {
  'tickets.write': ['tickets.read'],
};

export interface PermissionSubject {
  role: string;
  permissions: readonly string[];
}

export const isDeveloper = (subject: Pick<PermissionSubject, 'role'> | null | undefined): boolean =>
  subject?.role === 'developer';

export const hasPermission = (
  subject: PermissionSubject | null | undefined,
  key: PermissionKey
): boolean => {
  if (!subject) return false;
  if (isDeveloper(subject)) return true;
  if (subject.permissions.includes(key)) return true;
  return (Object.entries(IMPLIES) as [PermissionKey, PermissionKey[]][]).some(
    ([granted, implied]) => subject.permissions.includes(granted) && implied.includes(key)
  );
};

export const hasAnyPermission = (
  subject: PermissionSubject | null | undefined,
  keys: readonly PermissionKey[]
): boolean => keys.some((k) => hasPermission(subject, k));
