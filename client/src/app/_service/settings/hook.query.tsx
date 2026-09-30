import api from '@/lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { adminSettingsReadResponse2SettingsSchema } from './adapter.apiToLocal';
import type { SettingsSchema } from './interface.schema';
import { ADMIN_SETTINGS_ROUTE } from './route.api';

interface QueryHookOptions {
  enabled?: boolean;
}

export const ADMIN_SETTINGS_QUERY_KEY = ['get-admin-settings'] as const;

const useGetAdminSettings = ({ options }: { options?: QueryHookOptions } = {}) =>
  useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEY,
    queryFn: api.get<SettingsSchema>(
      ADMIN_SETTINGS_ROUTE,
      adminSettingsReadResponse2SettingsSchema
    ),
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
  });

export { useGetAdminSettings };
