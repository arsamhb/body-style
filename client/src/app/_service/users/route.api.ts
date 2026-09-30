const ADMIN_USERS_ROUTE = '/admin/users';
const getAdminUsersRouteById = (id: string) => `${ADMIN_USERS_ROUTE}/${id}`;

export { ADMIN_USERS_ROUTE, getAdminUsersRouteById };
