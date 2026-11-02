import { isValidObjectId, Types } from 'mongoose';
import { ApiError } from '../../core/errors/ApiError';
import { cleanLocalized, defaultLocale } from '../../core/i18n/localized';
import { LocaleCode, LocalizedString } from '../../core/i18n/types';
import { PaginationParams } from '../../core/pagination';
import { triggerRevalidate } from '../../core/revalidate';
import {
  CatalogCategory,
  CatalogCategoryDocument,
} from './catalogCategory.model';
import { CatalogItem, CatalogItemDocument } from './catalogItem.model';
import { CatalogType, CatalogTypeDocument } from './catalogType.model';
import {
  buildSearch,
  buildSort,
  buildSpecFilter,
  slugify,
  validateSpecs,
} from './catalog.specs';
import { SPEC_KEY_REGEX, SpecDefinition } from './catalog.types';
import {
  CatalogCategoryCreatePayload,
  CatalogCategoryUpdatePayload,
  CatalogItemCreatePayload,
  CatalogItemUpdatePayload,
  CatalogTypeCreatePayload,
  CatalogTypeUpdatePayload,
  PublicItemsQuery,
  SpecDefinitionPayload,
} from './interface.payload';

const toMap = (v: LocalizedString | undefined) =>
  new Map(Object.entries(cleanLocalized(v)));
const assertId = (id: string, what: string) => {
  if (!isValidObjectId(id)) throw ApiError.notFound(`${what} not found`);
};

/** Guarantees a unique slug within a scope by appending -2, -3, … */
const uniqueSlug = async (
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> => {
  const root = slugify(base) || 'item';
  let candidate = root;
  for (let i = 2; await exists(candidate); i += 1) candidate = `${root}-${i}`;
  return candidate;
};

const revalidateType = (slug: string, itemSlug?: string) =>
  triggerRevalidate([
    'catalog:types',
    `catalog:type:${slug}`,
    'catalog:items',
    ...(itemSlug ? [`catalog:item:${itemSlug}`] : []),
    'page:landing',
  ]);

/* ============================ TYPES (developer) ============================ */

const normalizeSpecDefinitions = (
  defs: SpecDefinitionPayload[] | undefined,
): SpecDefinition[] =>
  (defs ?? []).map((d, index) => ({
    key: d.key,
    label: toMap(d.label) as never,
    type: d.type,
    unit: toMap(d.unit) as never,
    currency: d.currency ?? '',
    options: (d.options ?? []).map((o) => ({
      value: o.value,
      label: toMap(o.label) as never,
    })),
    filterable: d.filterable ?? false,
    showOnCard: d.showOnCard ?? false,
    showOnDetail: d.showOnDetail ?? true,
    required: d.required ?? false,
    order: d.order ?? index,
  }));

/** Card/filter config may only reference keys that exist in the definitions. */
const assertReferencedKeys = (type: CatalogTypeDocument) => {
  const keys = new Set(type.specDefinitions.map((d) => d.key));
  const bad: string[] = [];
  const check = (k: string, where: string) => {
    if (k && !keys.has(k)) bad.push(`${where}: ${k}`);
  };
  type.cardDesign.cardSpecKeys.forEach((k) =>
    check(k, 'cardDesign.cardSpecKeys'),
  );
  check(type.cardDesign.badgeSpecKey, 'cardDesign.badgeSpecKey');
  check(type.cardDesign.priceSpecKey, 'cardDesign.priceSpecKey');
  type.filterConfig.enabledFilterKeys.forEach((k) =>
    check(k, 'filterConfig.enabledFilterKeys'),
  );
  type.filterConfig.sortKeys.forEach((k) => check(k, 'filterConfig.sortKeys'));
  if (bad.length) {
    throw ApiError.validation(
      bad.map((b) => ({
        field: b.split(':')[0],
        code: 'unknown-spec',
        message: `Unknown spec key ${b}`,
      })),
    );
  }
};

export const listTypes = () =>
  CatalogType.find().sort({ order: 1, createdAt: 1 }).exec();

export const countItemsByType = async (): Promise<Map<string, number>> => {
  const rows = await CatalogItem.aggregate<{ _id: Types.ObjectId; n: number }>([
    { $group: { _id: '$typeId', n: { $sum: 1 } } },
  ]);
  return new Map(rows.map((r) => [String(r._id), r.n]));
};

export const getType = async (id: string): Promise<CatalogTypeDocument> => {
  assertId(id, 'Catalog type');
  const type = await CatalogType.findById(id);
  if (!type) throw ApiError.notFound('Catalog type not found');
  return type;
};

export const createType = async (
  payload: CatalogTypeCreatePayload,
): Promise<CatalogTypeDocument> => {
  const name = cleanLocalized(payload.name);
  const slug = await uniqueSlug(
    payload.slug || name[defaultLocale()] || name.en || 'type',
    async (s) => Boolean(await CatalogType.exists({ slug: s })),
  );
  const type = new CatalogType({
    slug,
    name: toMap(payload.name),
    description: toMap(payload.description),
    specDefinitions: normalizeSpecDefinitions(payload.specDefinitions),
    cardDesign: { ...payload.cardDesign },
    filterConfig: { ...payload.filterConfig },
    seo: {
      title: toMap(payload.seo?.title),
      description: toMap(payload.seo?.description),
    },
    enabled: payload.enabled ?? true,
    order: payload.order ?? (await CatalogType.countDocuments()),
  });
  assertReferencedKeys(type);
  await type.save();
  revalidateType(type.slug);
  return type;
};

export const updateType = async (
  id: string,
  payload: CatalogTypeUpdatePayload,
): Promise<CatalogTypeDocument> => {
  const type = await getType(id);
  const oldSlug = type.slug;
  if (payload.slug !== undefined && payload.slug !== type.slug) {
    if (
      await CatalogType.exists({ slug: payload.slug, _id: { $ne: type._id } })
    )
      throw ApiError.conflict('Slug already in use');
    type.slug = payload.slug;
  }
  if (payload.name !== undefined) type.name = toMap(payload.name);
  if (payload.description !== undefined)
    type.description = toMap(payload.description);
  if (payload.specDefinitions !== undefined) {
    const before = new Set(type.specDefinitions.map((d) => d.key));
    type.specDefinitions = normalizeSpecDefinitions(payload.specDefinitions);
    const after = new Set(type.specDefinitions.map((d) => d.key));
    const removed = [...before].filter((k) => !after.has(k));
    if (removed.length) {
      // Strip values of dropped specs from items so stale data never leaks to the public API.
      await CatalogItem.updateMany(
        { typeId: type._id },
        { $unset: Object.fromEntries(removed.map((k) => [`specs.${k}`, 1])) },
      );
    }
  }
  if (payload.cardDesign !== undefined)
    Object.assign(type.cardDesign, payload.cardDesign);
  if (payload.filterConfig !== undefined)
    Object.assign(type.filterConfig, payload.filterConfig);
  if (payload.seo) {
    if (payload.seo.title !== undefined)
      type.seo.title = toMap(payload.seo.title);
    if (payload.seo.description !== undefined)
      type.seo.description = toMap(payload.seo.description);
  }
  if (payload.enabled !== undefined) type.enabled = payload.enabled;
  if (payload.order !== undefined) type.order = payload.order;
  assertReferencedKeys(type);
  type.markModified('specDefinitions');
  type.markModified('cardDesign');
  type.markModified('filterConfig');
  await type.save();
  revalidateType(type.slug);
  if (oldSlug !== type.slug) triggerRevalidate([`catalog:type:${oldSlug}`]);
  return type;
};

export const deleteType = async (id: string): Promise<void> => {
  const type = await getType(id);
  const items = await CatalogItem.countDocuments({ typeId: type._id });
  if (items > 0)
    throw ApiError.conflict(
      `Delete or move the ${items} items of this type first`,
    );
  await CatalogCategory.deleteMany({ typeId: type._id });
  await type.deleteOne();
  revalidateType(type.slug);
};

/* ============================ CATEGORIES ============================ */

export const listCategories = (typeId?: string) =>
  CatalogCategory.find(typeId && isValidObjectId(typeId) ? { typeId } : {})
    .sort({ typeId: 1, order: 1 })
    .exec();

export const getCategory = async (
  id: string,
): Promise<CatalogCategoryDocument> => {
  assertId(id, 'Category');
  const c = await CatalogCategory.findById(id);
  if (!c) throw ApiError.notFound('Category not found');
  return c;
};

/**
 * Checks a requested parent: same type, top-level itself (one level of nesting), and not the
 * category being edited. Returns the parent id, or null for a top-level category.
 */
const resolveParent = async (
  typeId: Types.ObjectId,
  parentId: string | null | undefined,
  selfId?: Types.ObjectId,
): Promise<Types.ObjectId | null> => {
  if (!parentId) return null;
  const fail = (message: string) =>
    ApiError.validation([
      { field: 'parentId', code: 'invalid-parent', message },
    ]);
  if (!isValidObjectId(parentId)) throw fail('Invalid id');
  if (selfId && String(selfId) === parentId)
    throw fail('A category cannot be its own parent');
  const parent = await CatalogCategory.findById(parentId);
  if (!parent || String(parent.typeId) !== String(typeId))
    throw fail('Parent category does not belong to this type');
  if (parent.parentId) throw fail('Only one level of nesting is supported');
  if (selfId && (await CatalogCategory.exists({ parentId: selfId })))
    throw fail('This category has sub-categories, so it must stay top-level');
  return parent._id as Types.ObjectId;
};

/** A category's id plus the ids of its children, so a parent filter matches its whole subtree. */
export const withChildren = (
  categories: CatalogCategoryDocument[],
  ids: Types.ObjectId[],
): Types.ObjectId[] => {
  const wanted = new Set(ids.map(String));
  return categories
    .filter(
      (c) =>
        wanted.has(String(c._id)) ||
        (c.parentId && wanted.has(String(c.parentId))),
    )
    .map((c) => c._id as Types.ObjectId);
};

/** Published item count per category; a parent counts each item of its subtree once. */
export const countPublishedByCategory = async (
  type: CatalogTypeDocument,
  categories: CatalogCategoryDocument[],
): Promise<Map<string, number>> => {
  const items = await CatalogItem.find(
    { typeId: type._id, status: 'published' },
    { categoryIds: 1 },
  ).lean();
  const parentOf = new Map(
    categories.map((c) => [
      String(c._id),
      c.parentId ? String(c.parentId) : null,
    ]),
  );
  const counts = new Map<string, number>();
  for (const item of items) {
    const hit = new Set<string>();
    for (const id of item.categoryIds.map(String)) {
      if (!parentOf.has(id)) continue;
      hit.add(id);
      const parent = parentOf.get(id);
      if (parent) hit.add(parent);
    }
    hit.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  }
  return counts;
};

export const createCategory = async (
  payload: CatalogCategoryCreatePayload,
): Promise<CatalogCategoryDocument> => {
  const type = await getType(payload.typeId);
  const name = cleanLocalized(payload.name);
  const slug = await uniqueSlug(
    payload.slug || name[defaultLocale()] || name.en || 'category',
    async (s) =>
      Boolean(await CatalogCategory.exists({ typeId: type._id, slug: s })),
  );
  const c = await CatalogCategory.create({
    typeId: type._id,
    slug,
    parentId: await resolveParent(type._id as Types.ObjectId, payload.parentId),
    name: toMap(payload.name),
    order:
      payload.order ??
      (await CatalogCategory.countDocuments({ typeId: type._id })),
  });
  revalidateType(type.slug);
  return c;
};

export const updateCategory = async (
  id: string,
  payload: CatalogCategoryUpdatePayload,
): Promise<CatalogCategoryDocument> => {
  const c = await getCategory(id);
  if (payload.slug !== undefined && payload.slug !== c.slug) {
    if (
      await CatalogCategory.exists({
        typeId: c.typeId,
        slug: payload.slug,
        _id: { $ne: c._id },
      })
    )
      throw ApiError.conflict('Slug already in use');
    c.slug = payload.slug;
  }
  if (payload.parentId !== undefined)
    c.parentId = await resolveParent(
      c.typeId,
      payload.parentId,
      c._id as Types.ObjectId,
    );
  if (payload.name !== undefined) c.name = toMap(payload.name);
  if (payload.order !== undefined) c.order = payload.order;
  await c.save();
  const type = await CatalogType.findById(c.typeId);
  if (type) revalidateType(type.slug);
  return c;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const c = await getCategory(id);
  await CatalogItem.updateMany(
    { categoryIds: c._id },
    { $pull: { categoryIds: c._id } },
  );
  // Children of a deleted parent become top-level instead of disappearing.
  await CatalogCategory.updateMany(
    { parentId: c._id },
    { $set: { parentId: null } },
  );
  await c.deleteOne();
  const type = await CatalogType.findById(c.typeId);
  if (type) revalidateType(type.slug);
};

/* ============================ ITEMS ============================ */

interface AdminItemsQuery extends PaginationParams {
  typeId?: string;
  status?: string;
  q?: string;
  categoryId?: string;
}

export const listItemsPaginated = async ({
  limit,
  offset,
  typeId,
  status,
  q,
  categoryId,
}: AdminItemsQuery) => {
  const filter: Record<string, unknown> = {};
  if (typeId && isValidObjectId(typeId)) filter.typeId = typeId;
  if (status === 'draft' || status === 'published') filter.status = status;
  if (categoryId && isValidObjectId(categoryId)) {
    const all = await CatalogCategory.find({
      $or: [{ _id: categoryId }, { parentId: categoryId }],
    }).exec();
    filter.categoryIds = { $in: all.map((c) => c._id) };
  }
  const search = buildSearch(q, defaultLocale());
  if (search) Object.assign(filter, search);
  const [items, total] = await Promise.all([
    CatalogItem.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec(),
    CatalogItem.countDocuments(filter).exec(),
  ]);
  return { items, total };
};

export const getItem = async (id: string): Promise<CatalogItemDocument> => {
  assertId(id, 'Item');
  const item = await CatalogItem.findById(id);
  if (!item) throw ApiError.notFound('Item not found');
  return item;
};

const assertCategoriesBelong = async (
  typeId: Types.ObjectId,
  ids: string[] | undefined,
) => {
  if (!ids?.length) return [];
  const valid = ids.filter(isValidObjectId);
  const count = await CatalogCategory.countDocuments({
    _id: { $in: valid },
    typeId,
  });
  if (count !== valid.length) {
    throw ApiError.validation([
      {
        field: 'categoryIds',
        code: 'invalid',
        message: 'Some categories do not belong to this type',
      },
    ]);
  }
  return valid;
};

export const createItem = async (
  payload: CatalogItemCreatePayload,
): Promise<CatalogItemDocument> => {
  const type = await getType(payload.typeId);
  const title = cleanLocalized(payload.title);
  const slug = await uniqueSlug(
    payload.slug || title[defaultLocale()] || title.en || 'item',
    async (s) =>
      Boolean(await CatalogItem.exists({ typeId: type._id, slug: s })),
  );
  const item = await CatalogItem.create({
    typeId: type._id,
    slug,
    title: toMap(payload.title),
    summary: toMap(payload.summary),
    description: toMap(payload.description),
    coverImage: payload.coverImage ?? '',
    images: payload.images ?? [],
    categoryIds: await assertCategoriesBelong(
      type._id as Types.ObjectId,
      payload.categoryIds,
    ),
    specs: validateSpecs(type.specDefinitions, payload.specs),
    featured: payload.featured ?? false,
    order: payload.order ?? 0,
    status: payload.status ?? 'draft',
    seo: {
      title: toMap(payload.seo?.title),
      description: toMap(payload.seo?.description),
    },
  });
  revalidateType(type.slug, item.slug);
  return item;
};

export const updateItem = async (
  id: string,
  payload: CatalogItemUpdatePayload,
): Promise<CatalogItemDocument> => {
  const item = await getItem(id);
  const type = await getType(String(item.typeId));
  const oldSlug = item.slug;
  if (payload.slug !== undefined && payload.slug !== item.slug) {
    if (
      await CatalogItem.exists({
        typeId: item.typeId,
        slug: payload.slug,
        _id: { $ne: item._id },
      })
    )
      throw ApiError.conflict('Slug already in use');
    item.slug = payload.slug;
  }
  if (payload.title !== undefined) item.title = toMap(payload.title);
  if (payload.summary !== undefined) item.summary = toMap(payload.summary);
  if (payload.description !== undefined)
    item.description = toMap(payload.description);
  if (payload.coverImage !== undefined) item.coverImage = payload.coverImage;
  if (payload.images !== undefined) item.images = payload.images;
  if (payload.categoryIds !== undefined) {
    item.categoryIds = (
      await assertCategoriesBelong(
        type._id as Types.ObjectId,
        payload.categoryIds,
      )
    ).map((v) => new Types.ObjectId(v));
  }
  if (payload.specs !== undefined) {
    item.specs = validateSpecs(type.specDefinitions, payload.specs);
    item.markModified('specs');
  }
  if (payload.featured !== undefined) item.featured = payload.featured;
  if (payload.order !== undefined) item.order = payload.order;
  if (payload.status !== undefined) item.status = payload.status;
  if (payload.seo) {
    if (payload.seo.title !== undefined)
      item.seo.title = toMap(payload.seo.title);
    if (payload.seo.description !== undefined)
      item.seo.description = toMap(payload.seo.description);
  }
  await item.save();
  revalidateType(type.slug, item.slug);
  if (oldSlug !== item.slug) triggerRevalidate([`catalog:item:${oldSlug}`]);
  return item;
};

export const deleteItem = async (id: string): Promise<void> => {
  const item = await getItem(id);
  const type = await CatalogType.findById(item.typeId);
  await item.deleteOne();
  if (type) revalidateType(type.slug, item.slug);
};

/* ============================ PUBLIC ============================ */

export const getEnabledTypeBySlug = async (
  slug: string,
): Promise<CatalogTypeDocument> => {
  const type = await CatalogType.findOne({ slug, enabled: true });
  if (!type) throw ApiError.notFound('Catalog type not found');
  return type;
};

export const listEnabledTypes = () =>
  CatalogType.find({ enabled: true }).sort({ order: 1 }).exec();

export const countPublishedByType = async (): Promise<Map<string, number>> => {
  const rows = await CatalogItem.aggregate<{ _id: Types.ObjectId; n: number }>([
    { $match: { status: 'published' } },
    { $group: { _id: '$typeId', n: { $sum: 1 } } },
  ]);
  return new Map(rows.map((r) => [String(r._id), r.n]));
};

export const listPublishedItems = async (
  type: CatalogTypeDocument,
  categories: CatalogCategoryDocument[],
  query: PublicItemsQuery,
  { limit, offset }: PaginationParams,
  locale: LocaleCode,
) => {
  const and: Record<string, unknown>[] = [
    { typeId: type._id, status: 'published' },
  ];
  const categorySlug =
    typeof query.category === 'string' ? query.category : undefined;
  if (categorySlug && type.filterConfig.categoriesEnabled) {
    const wanted = withChildren(
      categories,
      categories
        .filter((c) => categorySlug.split(',').includes(c.slug))
        .map((c) => c._id as Types.ObjectId),
    );
    and.push(wanted.length ? { categoryIds: { $in: wanted } } : { _id: null });
  }
  if (type.filterConfig.searchEnabled) {
    const search = buildSearch(query.q, locale);
    if (search) and.push(search);
  }
  and.push(...buildSpecFilter(type.specDefinitions, type.filterConfig, query));
  const filter = { $and: and };
  const sort = buildSort(type.filterConfig, query.sort, locale);
  const [items, total] = await Promise.all([
    CatalogItem.find(filter).sort(sort).skip(offset).limit(limit).exec(),
    CatalogItem.countDocuments(filter).exec(),
  ]);
  return { items, total };
};

export const getPublishedItem = async (
  type: CatalogTypeDocument,
  itemSlug: string,
): Promise<CatalogItemDocument> => {
  const item = await CatalogItem.findOne({
    typeId: type._id,
    slug: itemSlug,
    status: 'published',
  });
  if (!item) throw ApiError.notFound('Item not found');
  return item;
};

interface HighlightProps {
  typeSlug?: string;
  mode?: 'featured' | 'manual';
  itemIds?: string[];
  limit?: number;
}

/** Items for the `catalogHighlights` section: featured (or hand-picked) published items. */
export const getHighlightItems = async (props: HighlightProps) => {
  const type = props.typeSlug
    ? await CatalogType.findOne({ slug: props.typeSlug, enabled: true })
    : await CatalogType.findOne({ enabled: true }).sort({ order: 1 });
  if (!type) return null;
  const limit = Math.min(Math.max(props.limit ?? 4, 1), 12);
  const base = { typeId: type._id, status: 'published' as const };
  let items: CatalogItemDocument[];
  if (props.mode === 'manual' && props.itemIds?.length) {
    const ids = props.itemIds.filter(isValidObjectId);
    items = await CatalogItem.find({ ...base, _id: { $in: ids } }).exec();
    items.sort(
      (a, b) => ids.indexOf(String(a._id)) - ids.indexOf(String(b._id)),
    );
  } else {
    items = await CatalogItem.find({ ...base, featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .exec();
    if (items.length < limit) {
      const more = await CatalogItem.find({
        ...base,
        _id: { $nin: items.map((i) => i._id) },
      })
        .sort({ order: 1, createdAt: -1 })
        .limit(limit - items.length)
        .exec();
      items = [...items, ...more];
    }
  }
  const categories = await CatalogCategory.find({ typeId: type._id }).exec();
  return { type, items: items.slice(0, limit), categories };
};

export const isValidSpecKey = (key: string) => SPEC_KEY_REGEX.test(key);
