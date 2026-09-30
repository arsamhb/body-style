import { validateSpecs } from '../../modules/catalog/catalog.specs';
import { CatalogCategory } from '../../modules/catalog/catalogCategory.model';
import { CatalogItem } from '../../modules/catalog/catalogItem.model';
import { CatalogType } from '../../modules/catalog/catalogType.model';
import { L, P } from './content';

/**
 * A sample "Products" type showing every spec kind (price, select, number+unit, boolean,
 * multiselect, url), a card design that uses them, three categories and ten items.
 */
export const seedCatalog = async (): Promise<void> => {
  if (await CatalogType.exists({ slug: 'products' })) {
    console.log('ℹ️  Catalog already seeded — skipping.');
    return;
  }

  const type = await CatalogType.create({
    slug: 'products',
    name: L('محصولات', 'Products'),
    description: L(
      'تجهیزات و قطعات صنعتی با گارانتی معتبر.',
      'Industrial equipment and parts with valid warranty.',
    ),
    specDefinitions: [
      {
        key: 'price',
        label: L('قیمت', 'Price'),
        type: 'price',
        unit: {},
        currency: 'تومان',
        options: [],
        filterable: true,
        showOnCard: true,
        showOnDetail: true,
        required: false,
        order: 0,
      },
      {
        key: 'brand',
        label: L('برند', 'Brand'),
        type: 'select',
        unit: {},
        currency: '',
        options: [
          { value: 'siemens', label: L('زیمنس', 'Siemens') },
          { value: 'abb', label: L('ای‌بی‌بی', 'ABB') },
          { value: 'schneider', label: L('اشنایدر', 'Schneider') },
          { value: 'local', label: L('تولید داخل', 'Local') },
        ],
        filterable: true,
        showOnCard: true,
        showOnDetail: true,
        required: true,
        order: 1,
      },
      {
        key: 'weight',
        label: L('وزن', 'Weight'),
        type: 'number',
        unit: L('کیلوگرم', 'kg'),
        currency: '',
        options: [],
        filterable: true,
        showOnCard: false,
        showOnDetail: true,
        required: false,
        order: 2,
      },
      {
        key: 'inStock',
        label: L('موجود در انبار', 'In stock'),
        type: 'boolean',
        unit: {},
        currency: '',
        options: [],
        filterable: true,
        showOnCard: true,
        showOnDetail: true,
        required: false,
        order: 3,
      },
      {
        key: 'color',
        label: L('رنگ', 'Color'),
        type: 'multiselect',
        unit: {},
        currency: '',
        options: [
          { value: 'gray', label: L('خاکستری', 'Gray') },
          { value: 'black', label: L('مشکی', 'Black') },
          { value: 'blue', label: L('آبی', 'Blue') },
          { value: 'red', label: L('قرمز', 'Red') },
        ],
        filterable: true,
        showOnCard: false,
        showOnDetail: true,
        required: false,
        order: 4,
      },
      {
        key: 'power',
        label: L('توان', 'Power'),
        type: 'number',
        unit: L('کیلووات', 'kW'),
        currency: '',
        options: [],
        filterable: false,
        showOnCard: true,
        showOnDetail: true,
        required: false,
        order: 5,
      },
      {
        key: 'datasheet',
        label: L('دیتاشیت', 'Datasheet'),
        type: 'url',
        unit: {},
        currency: '',
        options: [],
        filterable: false,
        showOnCard: false,
        showOnDetail: true,
        required: false,
        order: 6,
      },
    ],
    cardDesign: {
      variant: 'imageTop',
      imageRatio: '4:3',
      showSummary: true,
      cardSpecKeys: ['brand', 'power'],
      badgeSpecKey: 'inStock',
      priceSpecKey: 'price',
    },
    filterConfig: {
      categoriesEnabled: true,
      searchEnabled: true,
      enabledFilterKeys: ['price', 'brand', 'inStock', 'color'],
      sortKeys: ['price'],
    },
    seo: {
      title: L('محصولات', 'Products'),
      description: L('فهرست محصولات صنعتی ما', 'Our industrial product range'),
    },
    enabled: true,
    order: 0,
  });

  const cats = await CatalogCategory.insertMany([
    {
      typeId: type._id,
      slug: 'motors',
      name: L('الکتروموتور', 'Electric motors'),
      order: 0,
    },
    { typeId: type._id, slug: 'pumps', name: L('پمپ', 'Pumps'), order: 1 },
    {
      typeId: type._id,
      slug: 'controls',
      name: L('تابلو و کنترل', 'Control gear'),
      order: 2,
    },
  ]);
  const cat = (slug: string) => cats.find((c) => c.slug === slug)!._id;

  const items = [
    {
      slug: 'motor-3kw',
      cat: 'motors',
      title: L('الکتروموتور ۳ کیلووات', '3 kW electric motor'),
      summary: L(
        'موتور سه‌فاز صنعتی با راندمان بالا',
        'High-efficiency three-phase industrial motor',
      ),
      specs: {
        price: 18500000,
        brand: 'siemens',
        weight: 24,
        inStock: true,
        color: ['gray'],
        power: 3,
        datasheet: 'https://example.com/datasheets/motor-3kw.pdf',
      },
      featured: true,
      img: 1,
    },
    {
      slug: 'motor-7-5kw',
      cat: 'motors',
      title: L('الکتروموتور ۷.۵ کیلووات', '7.5 kW electric motor'),
      summary: L('مناسب خطوط تولید سنگین', 'Built for heavy production lines'),
      specs: {
        price: 32000000,
        brand: 'abb',
        weight: 48,
        inStock: true,
        color: ['gray', 'blue'],
        power: 7.5,
      },
      featured: true,
      img: 2,
    },
    {
      slug: 'motor-15kw',
      cat: 'motors',
      title: L('الکتروموتور ۱۵ کیلووات', '15 kW electric motor'),
      summary: L(
        'نسخه IE3 با مصرف بهینه',
        'IE3 version with optimised consumption',
      ),
      specs: {
        price: 61000000,
        brand: 'siemens',
        weight: 96,
        inStock: false,
        color: ['gray'],
        power: 15,
      },
      featured: false,
      img: 3,
    },
    {
      slug: 'centrifugal-pump-2',
      cat: 'pumps',
      title: L('پمپ سانتریفیوژ ۲ اینچ', '2" centrifugal pump'),
      summary: L(
        'انتقال آب و سیالات کم‌ویسکوزیته',
        'Water and low-viscosity fluid transfer',
      ),
      specs: {
        price: 9800000,
        brand: 'local',
        weight: 18,
        inStock: true,
        color: ['blue'],
        power: 1.5,
      },
      featured: true,
      img: 4,
    },
    {
      slug: 'centrifugal-pump-4',
      cat: 'pumps',
      title: L('پمپ سانتریفیوژ ۴ اینچ', '4" centrifugal pump'),
      summary: L(
        'دبی بالا برای کاربردهای کشاورزی و صنعتی',
        'High flow for agricultural and industrial use',
      ),
      specs: {
        price: 21500000,
        brand: 'local',
        weight: 41,
        inStock: true,
        color: ['blue', 'red'],
        power: 5.5,
      },
      featured: false,
      img: 5,
    },
    {
      slug: 'submersible-pump',
      cat: 'pumps',
      title: L('پمپ شناور', 'Submersible pump'),
      summary: L('برای چاه‌های عمیق تا ۱۲۰ متر', 'Deep wells down to 120 m'),
      specs: {
        price: 27400000,
        brand: 'abb',
        weight: 33,
        inStock: false,
        color: ['black'],
        power: 4,
      },
      featured: false,
      img: 6,
    },
    {
      slug: 'contactor-40a',
      cat: 'controls',
      title: L('کنتاکتور ۴۰ آمپر', '40 A contactor'),
      summary: L(
        'کنتاکتور سه‌پل با بوبین ۲۲۰ ولت',
        'Three-pole contactor with 220 V coil',
      ),
      specs: {
        price: 1450000,
        brand: 'schneider',
        weight: 0.6,
        inStock: true,
        color: ['black'],
      },
      featured: true,
      img: 7,
    },
    {
      slug: 'vfd-5-5kw',
      cat: 'controls',
      title: L('اینورتر ۵.۵ کیلووات', '5.5 kW variable frequency drive'),
      summary: L(
        'کنترل دور موتور با ورودی سه‌فاز',
        'Motor speed control with three-phase input',
      ),
      specs: {
        price: 19800000,
        brand: 'siemens',
        weight: 4.2,
        inStock: true,
        color: ['gray'],
        power: 5.5,
        datasheet: 'https://example.com/datasheets/vfd.pdf',
      },
      featured: false,
      img: 8,
    },
    {
      slug: 'soft-starter-22kw',
      cat: 'controls',
      title: L('سافت استارتر ۲۲ کیلووات', '22 kW soft starter'),
      summary: L(
        'راه‌اندازی نرم برای کاهش شوک مکانیکی',
        'Soft start to reduce mechanical shock',
      ),
      specs: {
        price: 38000000,
        brand: 'abb',
        weight: 6.8,
        inStock: true,
        color: ['gray', 'black'],
        power: 22,
      },
      featured: false,
      img: 1,
    },
    {
      slug: 'control-panel-custom',
      cat: 'controls',
      title: L('تابلو برق سفارشی', 'Custom control panel'),
      summary: L(
        'طراحی و مونتاژ بر اساس نیاز پروژه',
        'Designed and assembled to project needs',
      ),
      specs: { brand: 'local', inStock: false, color: ['gray'] },
      featured: false,
      img: 2,
    },
  ];

  for (const [index, it] of items.entries()) {
    await CatalogItem.create({
      typeId: type._id,
      slug: it.slug,
      title: it.title,
      summary: it.summary,
      description: L(
        `${it.summary.fa}\n\nاین محصول با گارانتی معتبر شرکت سازنده عرضه می‌شود و تیم فنی ما نصب و راه‌اندازی آن را انجام می‌دهد. برای دریافت قیمت پروژه‌ای و مشاوره انتخاب مدل، از فرم زیر استفاده کنید.`,
        `${it.summary.en}\n\nShips with the manufacturer's official warranty; our field team handles installation and commissioning. Use the form below for project pricing and model selection advice.`,
      ),
      coverImage: `${P}/product-${it.img}.svg`,
      images: [
        `${P}/product-${it.img}.svg`,
        `${P}/sample-${(it.img % 6) + 1}.svg`,
      ],
      categoryIds: [cat(it.cat)],
      specs: validateSpecs(type.specDefinitions, it.specs),
      featured: it.featured,
      order: index,
      status: index === items.length - 1 ? 'draft' : 'published',
      seo: { title: {}, description: {} },
    });
  }
  console.log(
    `✅ Seeded catalog type "products" with ${cats.length} categories and ${items.length} items (1 draft)`,
  );
};
