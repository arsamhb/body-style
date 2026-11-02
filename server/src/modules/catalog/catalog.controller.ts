import { RequestHandler } from 'express';
import { localeFromRequest } from '../../core/locale';
import {
  buildPaginatedResponse,
  hasPaginationParams,
  parsePagination,
} from '../../core/pagination';
import * as service from './catalog.service';
import {
  catalogCategoryModel2CatalogCategoryAdminResponse,
  catalogItemModel2CatalogItemAdminResponse,
  catalogItemModel2CatalogItemCardResponse,
  catalogItemModel2CatalogItemPublicResponse,
  catalogTypeModel2CatalogTypeAdminResponse,
  catalogTypeModel2CatalogTypePublicResponse,
  catalogTypeModel2CatalogTypePublicSummary,
} from './adapter.modelToResponse';
import { CatalogCategory } from './catalogCategory.model';

/* ---------- types ---------- */
export const listTypes: RequestHandler = async (_req, res) => {
  const [types, counts] = await Promise.all([
    service.listTypes(),
    service.countItemsByType(),
  ]);
  res.json(
    types.map((t) =>
      catalogTypeModel2CatalogTypeAdminResponse(
        t,
        counts.get(String(t._id)) ?? 0,
      ),
    ),
  );
};
export const readType: RequestHandler = async (req, res) => {
  const type = await service.getType(String(req.params.id));
  const counts = await service.countItemsByType();
  res.json(
    catalogTypeModel2CatalogTypeAdminResponse(
      type,
      counts.get(String(type._id)) ?? 0,
    ),
  );
};
export const createType: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      catalogTypeModel2CatalogTypeAdminResponse(
        await service.createType(req.body),
      ),
    );
};
export const updateType: RequestHandler = async (req, res) => {
  const type = await service.updateType(String(req.params.id), req.body);
  const counts = await service.countItemsByType();
  res.json(
    catalogTypeModel2CatalogTypeAdminResponse(
      type,
      counts.get(String(type._id)) ?? 0,
    ),
  );
};
export const removeType: RequestHandler = async (req, res) => {
  await service.deleteType(String(req.params.id));
  res.json({ success: true });
};

/* ---------- categories ---------- */
export const listCategories: RequestHandler = async (req, res) => {
  const typeId =
    typeof req.query.typeId === 'string' ? req.query.typeId : undefined;
  res.json(
    (await service.listCategories(typeId)).map(
      catalogCategoryModel2CatalogCategoryAdminResponse,
    ),
  );
};
export const createCategory: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      catalogCategoryModel2CatalogCategoryAdminResponse(
        await service.createCategory(req.body),
      ),
    );
};
export const updateCategory: RequestHandler = async (req, res) => {
  res.json(
    catalogCategoryModel2CatalogCategoryAdminResponse(
      await service.updateCategory(String(req.params.id), req.body),
    ),
  );
};
export const removeCategory: RequestHandler = async (req, res) => {
  await service.deleteCategory(String(req.params.id));
  res.json({ success: true });
};

/* ---------- items ---------- */
export const listItems: RequestHandler = async (req, res) => {
  const params = hasPaginationParams(req.query)
    ? parsePagination(req.query)
    : { limit: 50, offset: 0 };
  const str = (k: string) =>
    typeof req.query[k] === 'string' ? (req.query[k] as string) : undefined;
  const { items, total } = await service.listItemsPaginated({
    ...params,
    typeId: str('typeId'),
    status: str('status'),
    q: str('q'),
    categoryId: str('categoryId'),
  });
  res.json(
    buildPaginatedResponse(
      items.map(catalogItemModel2CatalogItemAdminResponse),
      total,
      params,
    ),
  );
};
export const readItem: RequestHandler = async (req, res) => {
  res.json(
    catalogItemModel2CatalogItemAdminResponse(
      await service.getItem(String(req.params.id)),
    ),
  );
};
export const createItem: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      catalogItemModel2CatalogItemAdminResponse(
        await service.createItem(req.body),
      ),
    );
};
export const updateItem: RequestHandler = async (req, res) => {
  res.json(
    catalogItemModel2CatalogItemAdminResponse(
      await service.updateItem(String(req.params.id), req.body),
    ),
  );
};
export const updateItemStatus: RequestHandler = async (req, res) => {
  res.json(
    catalogItemModel2CatalogItemAdminResponse(
      await service.updateItem(String(req.params.id), {
        status: req.body.status,
      }),
    ),
  );
};
export const removeItem: RequestHandler = async (req, res) => {
  await service.deleteItem(String(req.params.id));
  res.json({ success: true });
};

/* ---------- public ---------- */
const cache = (res: Parameters<RequestHandler>[1]) =>
  res.setHeader(
    'Cache-Control',
    'public, max-age=60, stale-while-revalidate=300',
  );

export const publicListTypes: RequestHandler = async (req, res) => {
  const locale = localeFromRequest(req);
  const [types, counts] = await Promise.all([
    service.listEnabledTypes(),
    service.countPublishedByType(),
  ]);
  cache(res);
  res.json(
    types.map((t) =>
      catalogTypeModel2CatalogTypePublicSummary(
        t,
        locale,
        counts.get(String(t._id)) ?? 0,
      ),
    ),
  );
};

export const publicReadType: RequestHandler = async (req, res) => {
  const locale = localeFromRequest(req);
  const type = await service.getEnabledTypeBySlug(String(req.params.typeSlug));
  const [categories, counts] = await Promise.all([
    CatalogCategory.find({ typeId: type._id }).exec(),
    service.countPublishedByType(),
  ]);
  const categoryCounts = await service.countPublishedByCategory(
    type,
    categories,
  );
  cache(res);
  res.json(
    catalogTypeModel2CatalogTypePublicResponse(
      type,
      categories,
      locale,
      counts.get(String(type._id)) ?? 0,
      categoryCounts,
    ),
  );
};

export const publicListItems: RequestHandler = async (req, res) => {
  const locale = localeFromRequest(req);
  const type = await service.getEnabledTypeBySlug(String(req.params.typeSlug));
  const categories = await CatalogCategory.find({ typeId: type._id }).exec();
  const params = hasPaginationParams(req.query)
    ? parsePagination(req.query)
    : { limit: 24, offset: 0 };
  const { items, total } = await service.listPublishedItems(
    type,
    categories,
    req.query as Record<string, unknown>,
    params,
    locale,
  );
  cache(res);
  res.json(
    buildPaginatedResponse(
      items.map((i) =>
        catalogItemModel2CatalogItemCardResponse(i, type, categories, locale),
      ),
      total,
      params,
    ),
  );
};

export const publicReadItem: RequestHandler = async (req, res) => {
  const locale = localeFromRequest(req);
  const type = await service.getEnabledTypeBySlug(String(req.params.typeSlug));
  const item = await service.getPublishedItem(
    type,
    String(req.params.itemSlug),
  );
  const categories = await CatalogCategory.find({ typeId: type._id }).exec();
  cache(res);
  res.json(
    catalogItemModel2CatalogItemPublicResponse(item, type, categories, locale),
  );
};
