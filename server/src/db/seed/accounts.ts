import { config } from '../../config/env';
import { PermissionKey } from '../../core/auth/permissions';
import { Admin } from '../../modules/auth/auth.model';
import { hashPassword } from '../../modules/auth/auth.service';

/**
 * Developer account (full access) + client admin account (limited permissions).
 * Also migrates legacy `superadmin` rows to `developer`.
 */
export const seedAccounts = async (): Promise<void> => {
  const migrated = await Admin.collection.updateMany(
    { role: 'superadmin' },
    { $set: { role: 'developer' } },
  );
  if (migrated.modifiedCount)
    console.log(
      `♻️  Migrated ${migrated.modifiedCount} superadmin → developer`,
    );

  const accounts = [
    {
      ...config.seedDeveloper,
      displayName: 'Developer',
      role: 'developer' as const,
      permissions: [] as PermissionKey[],
    },
    {
      ...config.seedAdmin,
      displayName: 'Client admin',
      role: 'admin' as const,
      permissions: [
        'catalog.items',
        'catalog.categories',
        'tickets.write',
        'media',
        'pages.landing',
      ] as PermissionKey[],
    },
  ];

  for (const account of accounts) {
    if (!account.email || !account.password)
      throw new Error(
        `Refusing to seed the ${account.role} account: set ${account.role.toUpperCase()}_SEED_EMAIL and ${account.role.toUpperCase()}_SEED_PASSWORD (no defaults in production)`,
      );
    const existing = await Admin.findOne({ email: account.email });
    if (existing) {
      console.log(
        `ℹ️  ${account.role} ${account.email} already exists — skipping.`,
      );
      continue;
    }
    await Admin.create({
      email: account.email,
      passwordHash: await hashPassword(account.password),
      displayName: account.displayName,
      role: account.role,
      permissions: account.permissions,
      isActive: true,
    });
    console.log(`✅ Created ${account.role} ${account.email}`);
  }
};
