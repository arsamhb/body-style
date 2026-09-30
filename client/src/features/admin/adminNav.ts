import type { PermissionKey } from '@/lib/auth/permissions';

export interface AdminNavItem {
  key: string;
  href: string;
  icon: string;
  /** Visible only to developers. */
  developerOnly?: boolean;
  /** Visible when the account has any of these permissions (developers always pass). */
  permissionsAny?: PermissionKey[];
}

/**
 * Sidebar entries. Filtering happens in `Sidebar` via `useAuth().can`; the server enforces the
 * same rules, so hiding is purely UX. Entries are added as their screens are built.
 */
export const ADMIN_NAV: AdminNavItem[] = [
  { key: 'dashboard', href: '/admin', icon: 'layout-dashboard' },
  { key: 'tickets', href: '/admin/tickets', icon: 'inbox', permissionsAny: ['tickets.read'] },
  {
    key: 'pages',
    href: '/admin/pages',
    icon: 'file-text',
    permissionsAny: ['pages.landing', 'pages.about', 'pages.contact', 'pages.catalog'],
  },
  {
    key: 'catalog',
    href: '/admin/catalog/items',
    icon: 'package',
    permissionsAny: ['catalog.items', 'catalog.categories'],
  },
  {
    key: 'catalogCategories',
    href: '/admin/catalog/categories',
    icon: 'folder',
    permissionsAny: ['catalog.categories'],
  },
  { key: 'catalogTypes', href: '/admin/catalog/types', icon: 'layers', developerOnly: true },
  { key: 'media', href: '/admin/media', icon: 'image', permissionsAny: ['media'] },
  {
    key: 'settings',
    href: '/admin/settings',
    icon: 'settings',
    permissionsAny: [
      'settings.branding',
      'settings.navigation',
      'settings.contact',
      'settings.seo',
    ],
  },
  { key: 'users', href: '/admin/users', icon: 'users', developerOnly: true },
];

export const ADMIN_NAV_FOOTER: AdminNavItem[] = [
  { key: 'account', href: '/admin/account', icon: 'user' },
];
