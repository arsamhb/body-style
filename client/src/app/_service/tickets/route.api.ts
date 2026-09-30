const PUBLIC_TICKETS_ROUTE = '/public/tickets';
const PUBLIC_TICKETS_TOKEN_ROUTE = `${PUBLIC_TICKETS_ROUTE}/token`;
const ADMIN_TICKETS_ROUTE = '/admin/tickets';
const getAdminTicketsRouteById = (id: string) => `${ADMIN_TICKETS_ROUTE}/${id}`;
const ADMIN_DASHBOARD_ROUTE = '/admin/dashboard';

export {
  PUBLIC_TICKETS_ROUTE,
  PUBLIC_TICKETS_TOKEN_ROUTE,
  ADMIN_TICKETS_ROUTE,
  getAdminTicketsRouteById,
  ADMIN_DASHBOARD_ROUTE,
};
