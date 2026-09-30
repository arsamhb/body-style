'use client';

import { useAuth } from '@/context/AuthContext';
import type { PermissionKey } from '@/lib/auth/permissions';

interface CanProps {
  permission?: PermissionKey;
  anyOf?: PermissionKey[];
  developerOnly?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const useCan = () => {
  const { can, isDeveloper } = useAuth();
  return (opts: Pick<CanProps, 'permission' | 'anyOf' | 'developerOnly'>): boolean => {
    if (opts.developerOnly) return isDeveloper;
    if (opts.permission) return can(opts.permission);
    if (opts.anyOf?.length) return opts.anyOf.some((p) => can(p));
    return true;
  };
};

/** Renders children only when the current account may perform the action. UX only. */
const Can = ({ children, fallback = null, ...rule }: CanProps) => {
  const allowed = useCan()(rule);
  return <>{allowed ? children : fallback}</>;
};

export default Can;
