const ADMIN_PAGES_ROUTE = '/admin/pages';
const getAdminPagesRouteByKey = (key: string) => `${ADMIN_PAGES_ROUTE}/${key}`;
const getAdminPagesEnabledRouteByKey = (key: string) => `${ADMIN_PAGES_ROUTE}/${key}/enabled`;
const getAdminPagesSectionsRouteByKey = (key: string) => `${ADMIN_PAGES_ROUTE}/${key}/sections`;
const getAdminPagesSectionsReorderRouteByKey = (key: string) =>
  `${ADMIN_PAGES_ROUTE}/${key}/sections/reorder`;
const getAdminPagesSectionsRouteByKeyBySectionId = (key: string, sectionId: string) =>
  `${ADMIN_PAGES_ROUTE}/${key}/sections/${sectionId}`;
const PUBLIC_PAGES_ROUTE = '/public/pages';
const getPublicPagesRouteByKey = (key: string) => `${PUBLIC_PAGES_ROUTE}/${key}`;

export {
  ADMIN_PAGES_ROUTE,
  getAdminPagesRouteByKey,
  getAdminPagesEnabledRouteByKey,
  getAdminPagesSectionsRouteByKey,
  getAdminPagesSectionsReorderRouteByKey,
  getAdminPagesSectionsRouteByKeyBySectionId,
  PUBLIC_PAGES_ROUTE,
  getPublicPagesRouteByKey,
};
