import api from '@/lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { authMeReadResponse2AuthMeSchema } from './adapter.apiToLocal';
import type { AuthMeSchema } from './interface.schema';
import { AUTH_ME_ROUTE } from './route.api';

interface QueryHookOptions {
  enabled?: boolean;
}

export const AUTH_ME_QUERY_KEY = ['get-auth-me'] as const;

const useGetAuthMe = ({ options }: { options?: QueryHookOptions } = {}) =>
  useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: api.get<AuthMeSchema>(AUTH_ME_ROUTE, authMeReadResponse2AuthMeSchema),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
  });

export { useGetAuthMe };
