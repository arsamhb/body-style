'use client';

import { useTranslations } from 'next-intl';
import IconByName from '@/shared/UI/IconByName';
import type { PermissionKey } from '@/lib/auth/permissions';
import { useCan } from './Can';

interface RequirePermissionProps {
  permission?: PermissionKey;
  anyOf?: PermissionKey[];
  developerOnly?: boolean;
  children: React.ReactNode;
}

/** Page-level guard: shows a friendly 403 card instead of the screen. */
const RequirePermission = ({ children, ...rule }: RequirePermissionProps) => {
  const t = useTranslations('admin.common');
  const allowed = useCan()(rule);
  if (allowed) return <>{children}</>;
  return (
    <div className="m-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-line bg-surface p-10 text-center">
      <span className="icon-tile size-14">
        <IconByName name="lock" className="size-6" />
      </span>
      <h2 className="text-h4">{t('forbiddenTitle')}</h2>
      <p className="text-small text-ink-muted">{t('forbiddenText')}</p>
    </div>
  );
};

export default RequirePermission;
