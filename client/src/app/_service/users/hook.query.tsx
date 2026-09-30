import api from '@/lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import {
  adminUsersListReadResponse2UserListSchema,
  adminUsersReadResponse2UserSchema,
} from './adapter.apiToLocal';
import type { UserListSchema, UserSchema } from './interface.schema';
import { ADMIN_USERS_ROUTE, getAdminUsersRouteById } from './route.api';

interface QueryHookOptions {
  enabled?: boolean;
}

const useGetAdminUsersList = ({ options }: { options?: QueryHookOptions } = {}) =>
  useQuery({
    queryKey: ['get-admin-users-list'],
    queryFn: api.get<UserListSchema>(ADMIN_USERS_ROUTE, adminUsersListReadResponse2UserListSchema),
    enabled: options?.enabled ?? true,
  });

const useGetAdminUsersById = ({ id, options }: { id: string; options?: QueryHookOptions }) =>
  useQuery({
    queryKey: ['get-admin-users-by-id', id],
    queryFn: api.get<UserSchema>(getAdminUsersRouteById(id), adminUsersReadResponse2UserSchema),
    enabled: options?.enabled ?? true,
  });

export { useGetAdminUsersById, useGetAdminUsersList };
