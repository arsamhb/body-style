import { Page } from '../../modules/pages/pages.model';
import { validateSectionProps } from '../../modules/pages/sections.registry';
import {
  PageKey,
  SectionBase,
  SectionType,
} from '../../modules/pages/sections.types';
import { CATEGORY_TREE } from './catalog';
import { L, MISSING } from './content';

interface SeedSection {
  key: string;
  type: SectionType;
  props: Record<string, unknown>;
}

const section = (
  key: string,
  type: SectionType,
  props: Record<string, unknown>,
): SeedSection => ({ key, type, props });

/** One card per top-level category of the client's shop, listing its sub-categories. */
const categoryCard = (slug: string, icon: string) => {
  const node = CATEGORY_TREE.find((c) => c.slug === slug)!;
  return {
    icon,
    title: L(node.fa, node.en),
    text: L(
      node.children.map((c) => c.fa).join('، '),
      node.children.map((c) => c.en).join(', '),
    ),
    href: `/catalog/products?category=${node.slug}`,
  };
};

/**
 * Page copy. Landing, About and Contact text comes from the client's live site
 * (bodystyleco.com); sections the site has no content for (projects, testimonials, partner
 * logos) are left out rather than shown as placeholders.
 */
const PAGES: Record<
  PageKey,
  {
    seo: { title: Record<string, string>; description: Record<string, string> };
    sections: SeedSection[];
  }
> = {
  // Source: bodystyleco.com (home page).
  landing: {
    seo: {
      title: L(
        'بادی استایل | تولیدکننده دستگاه‌های بدنسازی خانگی و باشگاهی',
        'Body Style | Home and commercial gym machine manufacturer',
      ),
      description: L(
        'فروش مستقیم تجهیزات بدنسازی باشگاهی و خانگی بادی استایل با قیمت کارخانه، ضمانت اصلی، خدمات پس از فروش و ارسال به سراسر ایران.',
        'Body Style home and commercial gym equipment sold direct at factory prices, with a genuine warranty, after-sales service and delivery across Iran.',
      ),
    },
    sections: [
      section('landing-hero', 'hero', {
        eyebrow: L('بادی استایل', 'Body Style'),
        title: L(
          'فروش مستقیم تجهیزات بدنسازی باشگاهی با قیمت کارخانه',
          'Commercial gym equipment, direct at factory prices',
        ),
        subtitle: L(
          'تولیدکننده دستگاه‌های بدنسازی خانگی و باشگاهی با ضمانت اصلی',
          'Manufacturer of home and commercial gym machines with a genuine warranty',
        ),
        primaryCta: {
          label: L('کلیه محصولات', 'All products'),
          href: '/catalog/products',
        },
        secondaryCta: {
          label: L('ارتباط با ما', 'Contact us'),
          href: '/contact',
        },
        backgroundImage: '',
        pattern: 'dots',
      }),
      section('landing-intro', 'intro', {
        heading: L(
          'بادی استایل؛ همراه شما در مسیر تناسب اندام',
          'Body Style: with you on the road to fitness',
        ),
        body: L(
          'در دنیای امروز، داشتن تناسب اندام و سبک زندگی سالم به یکی از مهم‌ترین دغدغه‌های افراد تبدیل شده است. بادی استایل به‌عنوان تولیدکننده تخصصی دستگاه‌های بدنسازی خانگی و باشگاهی، با هدف فراهم‌کردن تجهیزات ورزشی باکیفیت، ایمن و حرفه‌ای، فعالیت خود را آغاز کرده و امروز به یکی از برندهای معتبر این حوزه در ایران تبدیل شده است.\n\nچه به‌دنبال خرید دستگاه بدنسازی خانگی باشید و چه قصد تجهیز یک باشگاه حرفه‌ای را داشته باشید، بادی استایل همراه مطمئن شماست. ما باور داریم که تجهیزات ورزشی باکیفیت، مسیر رسیدن به تناسب اندام را هموارتر می‌کنند.',
          'Today, staying fit and living healthily is one of people’s main concerns. Body Style is a specialist manufacturer of home and commercial gym machines. It set out to provide high-quality, safe and professional sports equipment, and is now one of the trusted brands in this field in Iran.\n\nWhether you are buying a home gym machine or equipping a professional gym, Body Style is a partner you can rely on. We believe quality equipment makes the road to fitness smoother.',
        ),
        image: '',
        imagePosition: 'end',
        cta: { label: L('درباره ما', 'About us'), href: '/about' },
      }),
      section('landing-features', 'features', {
        eyebrow: L('', ''),
        heading: L('تنوع محصولات بادی استایل', 'The Body Style range'),
        text: L(
          'در بادی استایل تلاش شده تا تنوع محصولات پاسخگوی نیازهای مختلف باشد. این تنوع به شما کمک می‌کند متناسب با فضا، بودجه و هدف تمرینی خود بهترین انتخاب را داشته باشید.',
          'Body Style’s range is built to meet different needs, so you can choose what fits your space, budget and training goals.',
        ),
        items: [
          categoryCard('gym-machines', 'layers'),
          categoryCard('weights', 'weight'),
          categoryCard('gym-equipment', 'dumbbell'),
          categoryCard('cardio', 'activity'),
        ],
      }),
      section('landing-highlights', 'catalogHighlights', {
        heading: L('دستگاه‌های منتخب', 'Featured machines'),
        text: L(
          'تمامی دستگاه‌های بدنسازی بادی استایل با رعایت استانداردهای ایمنی و کیفیت تولید می‌شوند. استفاده از رنگ الکترواستاتیک، جوشکاری صنعتی و طراحی اصولی باعث افزایش طول عمر و عملکرد بهتر محصولات شده است.',
          'Every Body Style machine is built to safety and quality standards. Electrostatic paint, industrial welding and sound design give the products a longer life and better performance.',
        ),
        typeSlug: 'products',
        mode: 'featured',
        itemIds: [],
        limit: 4,
      }),
      section('landing-stats', 'stats', {
        items: [
          {
            value: 100,
            suffix: '+',
            label: L('تعداد محصولات', 'Products'),
            icon: 'package',
          },
          {
            value: 250,
            suffix: '+',
            label: L('تعداد پروژه‌ها', 'Completed projects'),
            icon: 'building-2',
          },
          {
            value: 5,
            suffix: '+',
            label: L('پروژه‌های در حال انجام', 'Projects in progress'),
            icon: 'hammer',
          },
          {
            value: 24,
            suffix: '',
            label: L(
              'ساعت پاسخگویی، هفت روز هفته',
              'Hours a day, seven days a week, at your service',
            ),
            icon: 'headset',
          },
        ],
      }),
      section('landing-faq', 'faq', {
        heading: L('سوالات متداول', 'Frequently asked questions'),
        text: L('', ''),
        items: [
          {
            question: L(
              'آیا امکان خرید اقساطی دستگاه بدنسازی وجود دارد؟',
              'Can I buy gym machines in instalments?',
            ),
            answer: L(
              'بله، شرایط اقساطی برای باشگاه‌داران فراهم می‌باشد.',
              'Yes, instalment terms are available for gym owners.',
            ),
          },
          {
            question: L(
              'گارانتی دستگاه‌های بدنسازی معمولاً چند سال است؟',
              'How long is the warranty on gym machines?',
            ),
            answer: L(
              'بسته به برند و نوع دستگاه، گارانتی بین ۱ تا ۵ سال برای موتور (در دستگاه‌های کاردیو) و بین ۶ ماه تا ۲ سال برای قطعات مکانیکی ارائه می‌شود.',
              'Depending on the brand and machine, the warranty is 1 to 5 years on the motor (for cardio machines) and 6 months to 2 years on mechanical parts.',
            ),
          },
          {
            question: L(
              'چه نوع دستگاه‌های بدنسازی برای باشگاه مناسب هستند؟',
              'Which machines does a gym need?',
            ),
            answer: L(
              'دستگاه‌های وزنه آزاد، دستگاه‌های سیم‌کش، کاردیو (تردمیل، دوچرخه ثابت، الپتیکال) و دستگاه‌های چندکاره بسته به فضای باشگاه و تعداد اعضا ضروری هستند.',
              'Plate-loaded machines, cable machines, cardio (treadmills, exercise bikes, ellipticals) and multi-function machines, depending on the gym’s space and membership.',
            ),
          },
        ],
      }),
      section('landing-cta', 'ctaBanner', {
        heading: L('مشاوره رایگان خرید', 'Free buying advice'),
        text: L(
          'کارشناسان بادی استایل آماده ارائه مشاوره رایگان برای انتخاب بهترین دستگاه هستند. هفت روز هفته، ۲۴ ساعت شبانه‌روز پاسخگوی شما هستیم.',
          'Body Style’s experts offer free advice on choosing the right machine. We answer you seven days a week, 24 hours a day.',
        ),
        cta: { label: L('ارتباط با ما', 'Contact us'), href: '/contact' },
      }),
      section('landing-ticket', 'ticketForm', {
        heading: L('استعلام قیمت', 'Ask for a price'),
        text: L(
          'برای قیمت تماس بگیرید یا درخواست خود را ثبت کنید؛ بادی استایل امکان ارسال دستگاه‌های بدنسازی به تمام شهرهای ایران را فراهم کرده است.',
          'Call us for a price or send a request. Body Style delivers gym machines to every city in Iran.',
        ),
      }),
    ],
  },
  // Source: bodystyleco.com/درباره-ما. The page has no photos, so no section carries an image.
  about: {
    seo: {
      title: L('درباره ما', 'About us'),
      description: L(
        'شرکت بادی استایل به‌عنوان یکی از تولیدکنندگان معتبر تجهیزات ورزشی و بدنسازی در کشور، فعالیت خود را با هدف توسعه فناوری تولید داخلی و ارائه محصولات استاندارد',
        'Body Style is a respected domestic manufacturer of sports and bodybuilding equipment, built to advance local production technology and deliver standard products.',
      ),
    },
    sections: [
      section('about-hero', 'aboutHero', {
        image: '',
        title: L('درباره شرکت بادی استایل', 'About Body Style'),
        subtitle: L(
          'هر آنچه باید در مورد ما بدانید',
          'Everything you need to know about us',
        ),
      }),
      section('about-intro', 'intro', {
        heading: L(
          'معرفی رسمی شرکت بادی استایل',
          'The official introduction of Body Style',
        ),
        body: L(
          'شرکت بادی استایل به‌عنوان یکی از تولیدکنندگان معتبر تجهیزات ورزشی و بدنسازی در کشور، فعالیت خود را با هدف توسعه فناوری تولید داخلی و ارائه محصولات استاندارد در حوزه فیتنس آغاز کرده است. این شرکت با بهره‌گیری از ساختار تولیدی مجهز، نیروهای متخصص و فرآیندهای کنترل کیفیت دقیق، توانسته جایگاهی پایدار و حرفه‌ای در صنعت تجهیزات ورزشی ایران به دست آورد.',
          'Body Style is a respected domestic manufacturer of sports and bodybuilding equipment. It started with the aim of advancing local production technology and delivering standard fitness products. With a well-equipped production line, specialist staff and precise quality-control processes, it has earned a lasting, professional position in Iran’s sports equipment industry.',
        ),
        image: '',
        imagePosition: 'end',
      }),
      section('about-scope', 'features', {
        eyebrow: L('', ''),
        heading: L('حوزه فعالیت و تخصص', 'Scope and expertise'),
        text: L(
          'شرکت بادی استایل در زمینه طراحی، مهندسی و تولید تجهیزات بدنسازی شامل موارد زیر فعالیت می‌کند:',
          'Body Style designs, engineers and manufactures bodybuilding equipment, including:',
        ),
        items: [
          {
            icon: 'dumbbell',
            title: L(
              'دستگاه‌های قدرتی و مقاومتی',
              'Strength and resistance machines',
            ),
            text: L('', ''),
            href: '',
          },
          {
            icon: 'activity',
            title: L('تجهیزات هوازی', 'Aerobic equipment'),
            text: L('', ''),
            href: '',
          },
          {
            icon: 'weight',
            title: L(
              'وزنه‌های آزاد، هالتر و دیسک',
              'Free weights, barbells and discs',
            ),
            text: L('', ''),
            href: '',
          },
          {
            icon: 'zap',
            title: L(
              'تجهیزات کراس‌فیت و فانکشنال',
              'CrossFit and functional equipment',
            ),
            text: L('', ''),
            href: '',
          },
          {
            icon: 'building-2',
            title: L('ملزومات تخصصی باشگاهی', 'Specialist gym supplies'),
            text: L('', ''),
            href: '',
          },
        ],
      }),
      section('about-quality', 'achievements', {
        heading: L('چارچوب کیفیت و استانداردها', 'Quality and standards'),
        text: L(
          'بادی استایل ضمن توسعه فناوری تولید، رعایت اصول مهندسی و استفاده از مواد اولیه استاندارد، بخشی از محصولات خود را تحت استانداردهای بین‌المللی از جمله ISO 9001 و CE اروپا تولید می‌کند.',
          'Alongside advancing production technology, applying engineering principles and using standard raw materials, Body Style makes part of its products under international standards including ISO 9001 and European CE.',
        ),
        items: [
          {
            title: L('استاندارد ISO 9001', 'ISO 9001 standard'),
            text: L('', ''),
            year: null,
            image: '',
            icon: 'badge-check',
          },
          {
            title: L('استاندارد CE اروپا', 'European CE standard'),
            text: L('', ''),
            year: null,
            image: '',
            icon: 'shield-check',
          },
          {
            title: L('تست‌های دوام', 'Durability tests'),
            text: L('', ''),
            year: null,
            image: '',
            icon: 'gauge',
          },
          {
            title: L('کنترل کیفی چندمرحله‌ای', 'Multi-stage quality control'),
            text: L('', ''),
            year: null,
            image: '',
            icon: 'layers',
          },
          {
            title: L('سیستم‌های تولید پیشرفته', 'Advanced production systems'),
            text: L('', ''),
            year: null,
            image: '',
            icon: 'settings',
          },
        ],
      }),
      section('about-advantages', 'features', {
        eyebrow: L('', ''),
        heading: L('مزیت‌های رقابتی', 'Competitive advantages'),
        text: L('', ''),
        items: [
          {
            icon: 'factory',
            title: L('توانمندی تولید داخلی', 'Domestic production capability'),
            text: L(
              'با امکان سفارشی‌سازی تجهیزات براساس نیاز پروژه',
              'With equipment customised to the needs of each project',
            ),
            href: '',
          },
          {
            icon: 'shield-check',
            title: L('تضمین کیفیت ساخت', 'Guaranteed build quality'),
            text: L(
              'مبتنی بر فرایندهای تولید صنعتی و نظارت کارشناسی',
              'Based on industrial production processes and expert supervision',
            ),
            href: '',
          },
          {
            icon: 'layout-grid',
            title: L('تنوع محصول', 'Product variety'),
            text: L(
              'در سطوح حرفه‌ای و باشگاهی',
              'At professional and gym levels',
            ),
            href: '',
          },
          {
            icon: 'wrench',
            title: L(
              'خدمات پس از فروش گسترده',
              'Extensive after-sales service',
            ),
            text: L(
              'شامل گارانتی، تامین قطعات و پشتیبانی فنی',
              'Including warranty, spare parts and technical support',
            ),
            href: '',
          },
          {
            icon: 'tag',
            title: L('فروش مستقیم از کارخانه', 'Direct factory sales'),
            text: L(
              'و ارائه قیمت رقابتی در مقایسه با محصولات وارداتی',
              'With prices competitive against imported products',
            ),
            href: '',
          },
        ],
      }),
      section('about-mission', 'missionVision', {
        mission: {
          title: L('مأموریت سازمان', 'Our mission'),
          text: L(
            'تأمین و تولید تجهیزات بدنسازی استاندارد، ایمن و با دوام، با هدف بهبود کیفیت ارائه خدمات باشگاهی، حمایت از ورزش حرفه‌ای و ارتقای فرهنگ ورزش در جامعه.',
            'Supplying and manufacturing standard, safe and durable bodybuilding equipment, to improve the quality of gym services, support professional sport and raise sport culture in society.',
          ),
        },
        vision: {
          title: L('چشم‌انداز سازمانی', 'Our vision'),
          text: L(
            'شرکت بادی استایل با هدف ارتقای جایگاه صنعتی در سطح ملی و گسترش حضور در بازارهای منطقه‌ای، توسعه سبد محصولات و حرکت به سمت استانداردهای نوین تولید را در برنامه راهبردی خود قرار داده است. این مجموعه خود را متعهد به ارتقای کیفیت، نوآوری پایدار و افزایش سطح ایمنی تجهیزات ورزشی کشور می‌داند.',
            'To raise its industrial standing nationally and grow in regional markets, Body Style has made widening its product range and moving toward modern production standards part of its strategic plan. It is committed to higher quality, lasting innovation and safer sports equipment across the country.',
          ),
        },
        image: '',
      }),
      section('about-cta', 'ctaBanner', {
        heading: L('تماس با ما', 'Contact us'),
        text: L(
          'هفت روز هفته، ۲۴ ساعت شبانه‌روز پاسخگوی شما هستیم',
          'We answer you seven days a week, 24 hours a day',
        ),
        cta: { label: L('تماس با ما', 'Contact us'), href: '/contact' },
      }),
    ],
  },
  // Source: bodystyleco.com/تماس-با-ما. Phones, email, address and hours live in site settings
  // (contactWays) and feed both the contact cards and the footer.
  contact: {
    seo: {
      title: L('تماس با ما', 'Contact us'),
      description: L(
        'برای دریافت مشاوره خرید، پشتیبانی، یا همکاری با بادی استایل از طریق شماره تماس، آدرس و فرم تماس با ما اقدام کنید.',
        'For purchase advice, support or to work with Body Style, reach us by phone, at our address or through the contact form.',
      ),
    },
    sections: [
      section('contact-hero', 'contactHero', {
        image: '',
        title: L('تماس با ما', 'Contact us'),
        text: L(
          'هفت روز هفته، ۲۴ ساعت شبانه‌روز پاسخگوی شما هستیم',
          'We answer you seven days a week, 24 hours a day',
        ),
      }),
      section('contact-info', 'contactInfo', {
        heading: L('شبکه‌های ارتباطی', 'Ways to reach us'),
        text: L('', ''),
      }),
      section('contact-ticket', 'ticketForm', {
        heading: L('فرم تماس با ما', 'Contact form'),
        text: L('', ''),
      }),
      section('contact-map', 'map', {
        embedUrl:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d36659.8134942226!2d50.93311434969135!3d35.69422610775087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8d97a23ad3601b%3A0x2764ad42658f6f3f!2z2LTYsdqp2Kog2KjYp9iv24wg2KfYs9iq2KfbjNmE!5e0!3m2!1sfa!2s!4v1579642743718!5m2!1sfa!2s',
        address: L(
          'استان تهران، شهرستان ملارد، ابتدای صفادشت، خیابان آبشار، خیابان بنفشه چهارم غربی، اولین چهارراه سمت چپ',
          'Safadasht, Malard County, Tehran Province — Abshar St., West Banafsheh 4th St., first intersection on the left',
        ),
      }),
    ],
  },
  catalog: {
    seo: {
      title: L('محصولات', 'Products'),
      description: L(
        'کلیه محصولات بادی استایل: دستگاه بدنسازی وزنه آزاد و سیم‌کش، میز و نیمکت، وزنه، تجهیزات بدنسازی، تردمیل و دوچرخه.',
        'All Body Style products: plate-loaded and cable machines, benches, weights, gym equipment, treadmills and bikes.',
      ),
    },
    sections: [],
  },
};

/**
 * Creates every page with its sections. A page that already has content is left untouched,
 * unless it still carries MISSING placeholders from an earlier seed: that page was never
 * finished in the panel, so it is replaced with the current copy.
 */
export const seedPages = async (): Promise<void> => {
  for (const [key, def] of Object.entries(PAGES) as [
    PageKey,
    (typeof PAGES)[PageKey],
  ][]) {
    const existing = await Page.findOne({ key });
    const unfinished =
      existing &&
      JSON.stringify(existing.toObject({ flattenMaps: true })).includes(
        MISSING,
      );
    if (
      existing &&
      !unfinished &&
      (existing.sections.length > 0 || existing.seo.title.size > 0)
    ) {
      console.log(`ℹ️  Page "${key}" already seeded — skipping.`);
      continue;
    }
    const sections: SectionBase[] = [];
    for (const [index, s] of def.sections.entries()) {
      // Run the same validation as the API so the seed can never store an invalid shape.
      const props = (await validateSectionProps(s.type, s.props)) as Record<
        string,
        unknown
      >;
      sections.push({
        id: `seed-${s.key}`,
        key: s.key,
        type: s.type,
        enabled: true,
        order: index,
        props,
      });
    }
    await Page.findOneAndUpdate(
      { key },
      {
        $set: {
          enabled: true,
          seo: {
            title: def.seo.title,
            description: def.seo.description,
            ogImageUrl: '',
          },
          sections,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(
      `✅ ${unfinished ? 'Replaced unfinished' : 'Seeded'} page "${key}" with ${sections.length} sections`,
    );
  }
};
