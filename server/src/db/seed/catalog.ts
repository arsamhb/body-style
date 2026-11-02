import { validateSpecs } from '../../modules/catalog/catalog.specs';
import { CatalogCategory } from '../../modules/catalog/catalogCategory.model';
import { CatalogItem } from '../../modules/catalog/catalogItem.model';
import { CatalogType } from '../../modules/catalog/catalogType.model';
import type { SpecDefinition } from '../../modules/catalog/catalog.types';
import type { Types } from 'mongoose';
import { L, MISSING, missing } from './content';

/**
 * Category tree of the client's live shop (bodystyleco.com/shop): four parents, each with its
 * sub-categories, in the order of the site's menu. Items are filed under a sub-category; a
 * parent filter also matches everything below it.
 */
interface TreeNode {
  slug: string;
  fa: string;
  en: string;
  children: { slug: string; fa: string; en: string }[];
}

export const CATEGORY_TREE: TreeNode[] = [
  {
    slug: 'gym-machines',
    fa: 'دستگاه بدنسازی',
    en: 'Gym machines',
    children: [
      {
        slug: 'plate-loaded',
        fa: 'دستگاه بدنسازی وزنه آزاد',
        en: 'Plate-loaded machines',
      },
      {
        slug: 'cable-machines',
        fa: 'دستگاه سیم کش بدنسازی',
        en: 'Cable machines',
      },
      { slug: 'benches', fa: 'میز و نیمکت بدنسازی', en: 'Benches and racks' },
    ],
  },
  {
    slug: 'weights',
    fa: 'وزنه بدنسازی',
    en: 'Weights',
    children: [
      { slug: 'dumbbells', fa: 'دمبل', en: 'Dumbbells' },
      { slug: 'weight-plates', fa: 'صفحه هالتر', en: 'Weight plates' },
      { slug: 'kettlebells', fa: 'کتل بل', en: 'Kettlebells' },
      { slug: 'barbells', fa: 'باربل', en: 'Barbells' },
    ],
  },
  {
    slug: 'gym-equipment',
    fa: 'تجهیزات بدنسازی',
    en: 'Gym equipment',
    children: [
      {
        slug: 'bars-handles',
        fa: 'هالتر و دسته بدنسازی',
        en: 'Bars and handles',
      },
      { slug: 'crossfit', fa: 'کراس فیت', en: 'CrossFit' },
      { slug: 'yoga-pilates', fa: 'یوگا و پیلاتس', en: 'Yoga and Pilates' },
      { slug: 'flooring', fa: 'کفپوش', en: 'Gym flooring' },
    ],
  },
  {
    slug: 'cardio',
    fa: 'تردمیل و دوچرخه',
    en: 'Treadmills and bikes',
    children: [
      {
        slug: 'gym-treadmills',
        fa: 'تردمیل باشگاهی',
        en: 'Commercial treadmills',
      },
      {
        slug: 'manual-treadmills',
        fa: 'تردمیل مکانیکی',
        en: 'Manual treadmills',
      },
      { slug: 'gym-bikes', fa: 'دوچرخه باشگاهی', en: 'Exercise bikes' },
      { slug: 'air-bikes', fa: 'دوچرخه ایربایک', en: 'Air bikes' },
    ],
  },
];

/** Sub-categories the seeded machines are filed under (all are gym machines). */
export type Cat = 'plate-loaded' | 'cable-machines' | 'benches';

interface SeedItem {
  slug: string;
  cat: Cat;
  /** Name as written in the client's Word file. */
  titleFa: string;
  /** English name from the same file; empty when the client gave none. */
  titleEn: string;
  image: string;
  featured?: boolean;
}

const M = '/img/machines';
const C = '/img/catalog';

/**
 * The 22 machines of «دستگاههای تخصصی استایل.docx», in the client's order. Each is filed under
 * the sub-category the client's live shop uses for the same machine (cable vs. plate-loaded vs.
 * bench). Names and photos are the only facts the client supplied; the rest is MISSING.
 */
export const ITEMS: SeedItem[] = [
  {
    slug: 'preacher-curl',
    cat: 'cable-machines',
    titleFa: 'جلوبازو لاری ماشین',
    titleEn: '',
    image: `${M}/preacher-curl.jpg`,
  },
  {
    slug: 'leg-extension',
    cat: 'cable-machines',
    titleFa: 'جلوپا ماشین',
    titleEn: '',
    image: `${M}/leg-extension.jpg`,
  },
  {
    slug: 'smith',
    cat: 'plate-loaded',
    titleFa: 'اسمیت',
    titleEn: 'Smith Machine',
    image: `${M}/smith.jpg`,
    featured: true,
  },
  {
    slug: 'cross-lift',
    cat: 'cable-machines',
    titleFa: 'کراس جمع لایف',
    titleEn: 'Cross Lift',
    image: `${M}/cross-lift.jpg`,
  },
  {
    slug: 'lat-am',
    cat: 'cable-machines',
    titleFa: 'لت ای‌ام',
    titleEn: 'Lat AM',
    image: `${M}/lat-am.jpg`,
  },
  {
    slug: 'chest-fly-am',
    cat: 'cable-machines',
    titleFa: 'قفسه فلای ای‌ام',
    titleEn: 'Chest Fly AM',
    image: `${M}/chest-fly-am.jpg`,
  },
  {
    slug: 'seated-row-am',
    cat: 'cable-machines',
    titleFa: 'قایقی ای‌ام',
    titleEn: 'Seated Row AM',
    image: `${M}/seated-row-am.jpg`,
  },
  {
    slug: 'leg-curl-am',
    cat: 'cable-machines',
    titleFa: 'پشت پا ماشین ای‌ام',
    titleEn: 'Leg Curl AM',
    image: `${M}/leg-curl-am.jpg`,
  },
  {
    slug: 'overhead-smith',
    cat: 'plate-loaded',
    titleFa: 'اسمیت بالا سرشانه',
    titleEn: 'Overhead Smith',
    image: `${M}/overhead-smith.jpg`,
  },
  {
    slug: 'mechanic-dip',
    cat: 'plate-loaded',
    titleFa: 'دیپ مکانیک',
    titleEn: 'Mechanic Dip',
    image: `${M}/mechanic-dip.jpg`,
  },
  {
    slug: 'leg-press-rail',
    cat: 'plate-loaded',
    titleFa: 'پرس پا ریلی',
    titleEn: 'Leg Press Rail',
    image: `${M}/leg-press-rail.jpg`,
    featured: true,
  },
  {
    slug: 'hammer-short-h',
    cat: 'plate-loaded',
    titleFa: 'اچ کوتاه همر',
    titleEn: 'Hammer Short H',
    image: `${M}/hammer-short-h.jpg`,
  },
  {
    slug: 'hip-thrust-hammer',
    cat: 'plate-loaded',
    titleFa: 'پل باسن همر',
    titleEn: 'Hip Thrust Hammer',
    image: `${M}/hip-thrust-hammer.jpg`,
    featured: true,
  },
  {
    slug: 'hammer-lat',
    cat: 'plate-loaded',
    titleFa: 'لت همر',
    titleEn: 'Hammer Lat',
    image: `${M}/hammer-lat.jpg`,
  },
  {
    slug: 'glute-mechanic',
    cat: 'plate-loaded',
    titleFa: 'گلات مکانیک',
    titleEn: 'Glute Mechanic',
    image: `${M}/glute-mechanic.jpg`,
  },
  {
    slug: 'long-h',
    cat: 'plate-loaded',
    titleFa: 'اچ بلند',
    titleEn: 'Long H',
    image: `${M}/long-h.jpg`,
  },
  {
    slug: 'decline-bench',
    cat: 'benches',
    titleFa: 'میز زیر سینه',
    titleEn: 'Decline Bench',
    image: `${M}/decline-bench.jpg`,
  },
  {
    slug: 'chest-press',
    cat: 'plate-loaded',
    titleFa: 'پرس سینه',
    titleEn: 'Chest Press',
    image: `${M}/chest-press.jpg`,
  },
  {
    slug: 'incline-bench',
    cat: 'benches',
    titleFa: 'میز بالا سینه',
    titleEn: 'Incline Bench',
    image: `${M}/incline-bench.jpg`,
  },
  {
    slug: 'convergent-shoulder',
    cat: 'plate-loaded',
    titleFa: 'سرشانه همگرا',
    titleEn: 'Convergent Shoulder Press',
    image: `${M}/convergent-shoulder.jpg`,
  },
  {
    slug: 'convergent-chest',
    cat: 'plate-loaded',
    titleFa: 'پرس سینه همگرا',
    titleEn: 'Convergent Chest Press',
    image: `${M}/convergent-chest.jpg`,
    featured: true,
  },
  {
    slug: 'convergent-incline',
    cat: 'plate-loaded',
    titleFa: 'بالا سینه همگرا',
    titleEn: 'Convergent Incline Press',
    image: `${M}/convergent-incline.jpg`,
  },
];

/**
 * Photos in content/کاتالوگ that match no named machine. Each looks like another colour of a
 * machine in the list above; `like` is that guess, for the client to confirm or correct.
 */
const UNNAMED: { n: number; like: string }[] = [
  { n: 12, like: 'leg-curl-am' },
  { n: 14, like: 'chest-fly-am' },
  { n: 15, like: 'leg-curl-am' },
  { n: 16, like: 'lat-am' },
  { n: 17, like: 'chest-fly-am' },
  { n: 25, like: 'preacher-curl' },
  { n: 29, like: 'leg-extension' },
];

/**
 * Flat groups of the first seed (from the client's Word file). `syncCatalogTree` re-files items
 * found in them and then deletes them; an item it cannot place by slug goes to `fallback`.
 */
const LEGACY_CATEGORIES: Record<string, Cat | 'gym-machines'> = {
  compound: 'gym-machines',
  isolation: 'gym-machines',
  advanced: 'gym-machines',
  presses: 'gym-machines',
  unnamed: 'cable-machines',
};

/** Seeded name of the type before the restructure; replaced only while it is unedited. */
const OLD_TYPE_NAME_FA = 'دستگاه‌های تخصصی استایل';

const TYPE_NAME = L('محصولات', 'Products');
const TYPE_DESCRIPTION = L(
  'تولیدکننده دستگاه‌های بدنسازی خانگی و باشگاهی با ضمانت اصلی؛ دستگاه‌های وزنه آزاد و سیم‌کش، میز و نیمکت، وزنه، تجهیزات بدنسازی، تردمیل و دوچرخه.',
  'Manufacturer of home and commercial gym machines with a genuine warranty: plate-loaded and cable machines, benches, weights, gym equipment, treadmills and bikes.',
);

const NEEDED_FA = `${MISSING}: توضیح کامل دستگاه، عضلات هدف، ابعاد، وزن، قیمت، گارانتی، رنگ‌بندی و عکس‌های بیشتر.`;
const NEEDED_EN = `${MISSING}: full description, target muscles, dimensions, weight, price, warranty, colour options and more photos.`;

/**
 * Creates or updates the category tree for a type, matched by slug, so admin-made categories and
 * existing ids survive. Returns slug → id for every tree category.
 */
const upsertTree = async (
  typeId: Types.ObjectId,
): Promise<Map<string, Types.ObjectId>> => {
  const ids = new Map<string, Types.ObjectId>();
  const upsert = async (
    slug: string,
    fa: string,
    en: string,
    parentId: Types.ObjectId | null,
    order: number,
  ) => {
    const c = await CatalogCategory.findOneAndUpdate(
      { typeId, slug },
      { $set: { parentId, order }, $setOnInsert: { name: L(fa, en) } },
      { upsert: true, returnDocument: 'after' },
    );
    ids.set(slug, c._id as Types.ObjectId);
    return c._id as Types.ObjectId;
  };
  for (const [i, parent] of CATEGORY_TREE.entries()) {
    const parentId = await upsert(
      parent.slug,
      parent.fa,
      parent.en,
      null,
      i * 10,
    );
    for (const [j, child] of parent.children.entries())
      await upsert(child.slug, child.fa, child.en, parentId, i * 10 + j + 1);
  }
  return ids;
};

/** Where an already-seeded item belongs in the tree, by its slug. */
const targetFor = (slug: string): Cat | undefined => {
  const named = ITEMS.find((it) => it.slug === slug);
  if (named) return named.cat;
  const photo = UNNAMED.find(({ n }) => `catalog-${n}` === slug);
  return photo ? ITEMS.find((it) => it.slug === photo.like)?.cat : undefined;
};

/**
 * Migrates an existing catalog to the client's category tree without touching item content:
 * builds the tree, moves every item out of the legacy flat groups (by slug, else to the
 * group's fallback), then deletes the emptied legacy groups. Safe to run repeatedly.
 */
export const syncCatalogTree = async (): Promise<void> => {
  const type = await CatalogType.findOne({ slug: 'products' });
  if (!type) return;
  const typeId = type._id as Types.ObjectId;
  const tree = await upsertTree(typeId);

  const legacy = await CatalogCategory.find({
    typeId,
    slug: { $in: Object.keys(LEGACY_CATEGORIES) },
  });
  let moved = 0;
  if (legacy.length) {
    const legacyIds = new Set(legacy.map((c) => String(c._id)));
    const items = await CatalogItem.find({
      typeId,
      categoryIds: { $in: legacy.map((c) => c._id) },
    });
    for (const item of items) {
      const from = legacy.find((c) =>
        item.categoryIds.some((id) => String(id) === String(c._id)),
      )!;
      const target = tree.get(
        targetFor(item.slug) ?? LEGACY_CATEGORIES[from.slug],
      )!;
      const kept = item.categoryIds.filter((id) => !legacyIds.has(String(id)));
      if (!kept.some((id) => String(id) === String(target))) kept.push(target);
      item.categoryIds = kept;
      await item.save();
      moved += 1;
    }
    await CatalogCategory.deleteMany({
      _id: { $in: legacy.map((c) => c._id) },
    });
  }

  // The first seed put a placeholder summary on every machine; it shows on cards (and the
  // landing's featured machines), so clear it wherever it is still unedited.
  const placeholder = missing('توضیح کوتاه دستگاه', 'short description');
  const cleared = await CatalogItem.updateMany(
    { typeId, 'summary.fa': placeholder.fa },
    { $set: { summary: { fa: '', en: '' } } },
  );

  // Name and intro are replaced only while they are still the first seed's values.
  if (type.name.get('fa') === OLD_TYPE_NAME_FA) {
    type.name = new Map(Object.entries(TYPE_NAME));
    type.seo.title = new Map(Object.entries(TYPE_NAME));
  }
  if ((type.description.get('fa') ?? '').startsWith(MISSING))
    type.description = new Map(Object.entries(TYPE_DESCRIPTION));
  if ((type.seo.description.get('fa') ?? '').startsWith(MISSING))
    type.seo.description = new Map(Object.entries(TYPE_DESCRIPTION));
  await type.save();

  console.log(
    `✅ Catalog tree synced: ${tree.size} categories, ${moved} items re-filed, ${legacy.length} legacy groups removed, ${cleared.modifiedCount} placeholder summaries cleared`,
  );
};

export const seedCatalog = async (): Promise<void> => {
  if (await CatalogType.exists({ slug: 'products' })) {
    await syncCatalogTree();
    return;
  }

  // The client supplied no specifications. These are the slots to fill; every value is MISSING.
  const textSpec = (
    key: string,
    fa: string,
    en: string,
    order: number,
  ): SpecDefinition => ({
    key,
    label: L(fa, en),
    type: 'text',
    unit: {},
    currency: '',
    options: [],
    filterable: false,
    showOnCard: false,
    showOnDetail: true,
    required: false,
    order,
  });
  const specDefinitions: SpecDefinition[] = [
    textSpec('dimensions', 'ابعاد', 'Dimensions', 0),
    textSpec('weight', 'وزن', 'Weight', 1),
    textSpec('warranty', 'گارانتی', 'Warranty', 2),
    {
      ...textSpec('price', 'قیمت', 'Price', 3),
      type: 'price',
      currency: 'تومان',
    },
  ];

  const type = await CatalogType.create({
    slug: 'products',
    name: TYPE_NAME,
    description: TYPE_DESCRIPTION,
    specDefinitions,
    cardDesign: {
      variant: 'imageTop',
      imageRatio: '4:3',
      showSummary: true,
      cardSpecKeys: [],
      badgeSpecKey: '',
      priceSpecKey: 'price',
    },
    filterConfig: {
      categoriesEnabled: true,
      searchEnabled: true,
      enabledFilterKeys: [],
      sortKeys: [],
    },
    seo: {
      title: TYPE_NAME,
      description: TYPE_DESCRIPTION,
    },
    enabled: true,
    order: 0,
  });

  const cats = await upsertTree(type._id as Types.ObjectId);
  const catId = (slug: Cat) => cats.get(slug)!;
  // Price stays unset: the client gave none, and a price spec cannot hold a placeholder.
  const specs = validateSpecs(type.specDefinitions, {
    dimensions: MISSING,
    weight: MISSING,
    warranty: MISSING,
  });

  for (const [index, it] of ITEMS.entries()) {
    await CatalogItem.create({
      typeId: type._id,
      slug: it.slug,
      title: L(
        it.titleFa,
        it.titleEn || `${MISSING}: English name (${it.titleFa})`,
      ),
      // No short description from the client: cards show none rather than a placeholder.
      summary: L('', ''),
      description: L(NEEDED_FA, NEEDED_EN),
      coverImage: it.image,
      images: [it.image],
      categoryIds: [catId(it.cat)],
      specs,
      featured: Boolean(it.featured),
      order: index,
      status: 'published',
      seo: { title: {}, description: {} },
    });
  }

  for (const [index, { n, like }] of UNNAMED.entries()) {
    const guess = ITEMS.find((it) => it.slug === like)!;
    const image = `${C}/${n}.jpg`;
    await CatalogItem.create({
      typeId: type._id,
      slug: `catalog-${n}`,
      title: missing(
        `نام دستگاه (کاتالوگ/${n}.jpg)`,
        `machine name (catalog/${n}.jpg)`,
      ),
      summary: missing(
        `این عکس در فهرست نام‌ها نیست. شبیه «${guess.titleFa}» با رنگ دیگر است؛ از مشتری بپرسید.`,
        `this photo is not in the name list. It looks like “${guess.titleEn || guess.titleFa}” in another colour; ask the client.`,
      ),
      description: L(NEEDED_FA, NEEDED_EN),
      coverImage: image,
      images: [image],
      categoryIds: [catId(guess.cat)],
      specs,
      featured: false,
      order: ITEMS.length + index,
      status: 'published',
      seo: { title: {}, description: {} },
    });
  }

  console.log(
    `✅ Seeded catalog type "products" with ${cats.size} categories and ${ITEMS.length + UNNAMED.length} items`,
  );
};
