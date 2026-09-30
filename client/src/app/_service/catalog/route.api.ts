const ADMIN_CATALOG_ROUTE = '/admin/catalog';
const ADMIN_CATALOG_TYPES_ROUTE = `${ADMIN_CATALOG_ROUTE}/types`;
const getAdminCatalogTypesRouteById = (id: string) => `${ADMIN_CATALOG_TYPES_ROUTE}/${id}`;
const ADMIN_CATALOG_CATEGORIES_ROUTE = `${ADMIN_CATALOG_ROUTE}/categories`;
const getAdminCatalogCategoriesRouteById = (id: string) =>
  `${ADMIN_CATALOG_CATEGORIES_ROUTE}/${id}`;
const ADMIN_CATALOG_ITEMS_ROUTE = `${ADMIN_CATALOG_ROUTE}/items`;
const getAdminCatalogItemsRouteById = (id: string) => `${ADMIN_CATALOG_ITEMS_ROUTE}/${id}`;
const getAdminCatalogItemsStatusRouteById = (id: string) =>
  `${ADMIN_CATALOG_ITEMS_ROUTE}/${id}/status`;

export {
  ADMIN_CATALOG_ROUTE,
  ADMIN_CATALOG_TYPES_ROUTE,
  getAdminCatalogTypesRouteById,
  ADMIN_CATALOG_CATEGORIES_ROUTE,
  getAdminCatalogCategoriesRouteById,
  ADMIN_CATALOG_ITEMS_ROUTE,
  getAdminCatalogItemsRouteById,
  getAdminCatalogItemsStatusRouteById,
};
