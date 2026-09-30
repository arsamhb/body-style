import { Page } from '../../modules/pages/pages.model';
import { validateSectionProps } from '../../modules/pages/sections.registry';
import {
  PageKey,
  SectionBase,
  SectionType,
} from '../../modules/pages/sections.types';
import { L, P } from './content';

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

const PAGES: Record<
  PageKey,
  {
    seo: { title: Record<string, string>; description: Record<string, string> };
    sections: SeedSection[];
  }
> = {
  landing: {
    seo: {
      title: L('پارس تجهیز', 'Pars Equipment'),
      description: L(
        'راه‌حل‌های صنعتی قابل اعتماد، از طراحی تا اجرا',
        'Reliable industrial solutions, from design to delivery',
      ),
    },
    sections: [
      section('landing-hero', 'hero', {
        eyebrow: L('از ۱۳۸۲ در کنار صنعت', 'Serving industry since 2003'),
        title: L('پارس تجهیز', 'Pars Equipment'),
        subtitle: L(
          'راه‌حل‌های صنعتی قابل اعتماد، از طراحی تا اجرا',
          'Reliable industrial solutions, from design to delivery',
        ),
        primaryCta: {
          label: L('مشاهده محصولات', 'Browse products'),
          href: '/catalog/products',
        },
        secondaryCta: {
          label: L('درخواست مشاوره', 'Request a call'),
          href: '/contact',
        },
        backgroundImage: '',
        pattern: 'dots',
      }),
      section('landing-intro', 'intro', {
        heading: L('چه کاری انجام می‌دهیم؟', 'What we do'),
        body: L(
          'ما تأمین‌کننده تجهیزات و قطعات صنعتی برای کارخانه‌ها و پیمانکاران هستیم. از مشاوره فنی و انتخاب محصول تا تأمین، نصب و خدمات پس از فروش در کنار شما هستیم.\n\nتمرکز ما بر کیفیت پایدار، تحویل به‌موقع و پشتیبانی واقعی است.',
          'We supply industrial equipment and parts to factories and contractors. From technical consulting and product selection to procurement, installation and after-sales service, we stay with you.\n\nOur focus is consistent quality, on-time delivery and real support.',
        ),
        image: `${P}/hero.svg`,
        imagePosition: 'end',
        cta: { label: L('درباره ما', 'About us'), href: '/about' },
      }),
      section('landing-features', 'features', {
        eyebrow: L('خدمات ویژه', 'Highlights'),
        heading: L(
          'چرا مشتریان ما را انتخاب می‌کنند',
          'Why customers choose us',
        ),
        text: L(
          'مهم‌ترین خدماتی که ما را متمایز می‌کند.',
          'The services that set us apart.',
        ),
        items: [
          {
            icon: 'shield-check',
            title: L('تضمین کیفیت', 'Quality guarantee'),
            text: L(
              'همه محصولات با گارانتی معتبر و گواهی اصالت عرضه می‌شوند.',
              'Every product ships with a valid warranty and certificate of origin.',
            ),
            href: '',
          },
          {
            icon: 'truck',
            title: L('تحویل سریع', 'Fast delivery'),
            text: L(
              'ارسال به سراسر کشور در کمتر از ۴۸ ساعت برای اقلام موجود.',
              'Nationwide delivery in under 48 hours for in-stock items.',
            ),
            href: '',
          },
          {
            icon: 'headset',
            title: L('پشتیبانی فنی', 'Technical support'),
            text: L(
              'کارشناسان ما قبل و بعد از خرید پاسخگوی شما هستند.',
              'Our engineers answer before and after the purchase.',
            ),
            href: '',
          },
          {
            icon: 'wrench',
            title: L('نصب و راه‌اندازی', 'Installation'),
            text: L(
              'نصب تخصصی در محل توسط تیم فنی مجرب.',
              'On-site professional installation by our field team.',
            ),
            href: '',
          },
          {
            icon: 'coins',
            title: L('قیمت رقابتی', 'Competitive pricing'),
            text: L(
              'همکاری مستقیم با تولیدکنندگان برای بهترین قیمت.',
              'Direct partnerships with manufacturers for the best price.',
            ),
            href: '',
          },
          {
            icon: 'layers',
            title: L('تنوع محصول', 'Wide range'),
            text: L(
              'بیش از ۵۰۰ قلم محصول در دسته‌بندی‌های مختلف.',
              'Over 500 products across many categories.',
            ),
            href: '',
          },
        ],
      }),
      section('landing-highlights', 'catalogHighlights', {
        heading: L('محصولات منتخب', 'Featured products'),
        text: L(
          'پرفروش‌ترین‌ها و جدیدترین‌ها.',
          'Best sellers and new arrivals.',
        ),
        typeSlug: 'products',
        mode: 'featured',
        itemIds: [],
        limit: 4,
      }),
      section('landing-stats', 'stats', {
        items: [
          {
            value: 20,
            suffix: '+',
            label: L('سال تجربه', 'Years of experience'),
            icon: 'calendar',
          },
          {
            value: 1200,
            suffix: '+',
            label: L('پروژه انجام‌شده', 'Projects delivered'),
            icon: 'briefcase',
          },
          {
            value: 500,
            suffix: '+',
            label: L('محصول فعال', 'Active products'),
            icon: 'package',
          },
          {
            value: 98,
            suffix: '%',
            label: L('رضایت مشتری', 'Customer satisfaction'),
            icon: 'heart',
          },
        ],
      }),
      section('landing-samples', 'samples', {
        heading: L('نمونه کارها', 'Our work'),
        text: L(
          'گزیده‌ای از پروژه‌های اخیر.',
          'A selection of recent projects.',
        ),
        items: [1, 2, 3, 4, 5, 6].map((i) => ({
          image: `${P}/sample-${i}.svg`,
          title: L(`پروژه شماره ${i}`, `Project ${i}`),
          text: L(
            'تأمین و نصب تجهیزات خط تولید.',
            'Supply and installation of production-line equipment.',
          ),
          href: '',
        })),
      }),
      section('landing-testimonials', 'testimonials', {
        heading: L('مشتریان چه می‌گویند', 'What customers say'),
        items: [
          {
            quote: L(
              'تحویل به‌موقع و پشتیبانی عالی. دقیقاً همان چیزی که یک پروژه صنعتی نیاز دارد.',
              'On-time delivery and excellent support. Exactly what an industrial project needs.',
            ),
            author: L('علی رضایی', 'Ali Rezaei'),
            role: L('مدیر خرید، فولاد پارس', 'Procurement manager, Pars Steel'),
            avatar: `${P}/avatar-1.svg`,
          },
          {
            quote: L(
              'کارشناسان فنی با حوصله بهترین گزینه را پیشنهاد دادند.',
              'The engineers patiently recommended the best option for us.',
            ),
            author: L('مریم احمدی', 'Maryam Ahmadi'),
            role: L('مدیر پروژه', 'Project manager'),
            avatar: `${P}/avatar-2.svg`,
          },
          {
            quote: L(
              'سه سال است با این مجموعه کار می‌کنیم و هیچ‌وقت ناامید نشدیم.',
              "We've worked with them for three years and were never let down.",
            ),
            author: L('حسین کریمی', 'Hossein Karimi'),
            role: L('مدیرعامل', 'CEO'),
            avatar: `${P}/avatar-3.svg`,
          },
        ],
      }),
      section('landing-partners', 'partners', {
        heading: L('همکاران ما', 'Our partners'),
        logos: [1, 2, 3, 4, 5, 6].map((i) => ({
          image: `${P}/partner-${i}.svg`,
          name: `Partner ${i}`,
          href: '',
        })),
      }),
      section('landing-faq', 'faq', {
        heading: L('سوالات متداول', 'Frequently asked questions'),
        text: {},
        items: [
          {
            question: L(
              'زمان تحویل سفارش چقدر است؟',
              'How long does delivery take?',
            ),
            answer: L(
              'اقلام موجود در انبار ظرف ۴۸ ساعت ارسال می‌شوند. اقلام سفارشی بین ۲ تا ۶ هفته زمان می‌برند.',
              'In-stock items ship within 48 hours. Custom items take 2 to 6 weeks.',
            ),
          },
          {
            question: L('آیا نصب هم انجام می‌دهید؟', 'Do you also install?'),
            answer: L(
              'بله، تیم فنی ما نصب و راه‌اندازی را در محل انجام می‌دهد.',
              'Yes, our field team handles installation and commissioning on site.',
            ),
          },
          {
            question: L(
              'گارانتی محصولات چگونه است؟',
              'What warranty do products have?',
            ),
            answer: L(
              'همه محصولات دارای گارانتی معتبر شرکت سازنده هستند.',
              "All products carry the manufacturer's official warranty.",
            ),
          },
          {
            question: L('چطور قیمت بگیرم؟', 'How do I get a quote?'),
            answer: L(
              'از طریق فرم درخواست همین صفحه یا تماس تلفنی، ظرف یک روز کاری پاسخ می‌دهیم.',
              'Use the request form on this page or call us. We reply within one business day.',
            ),
          },
          {
            question: L(
              'آیا امکان بازدید حضوری هست؟',
              'Can we visit in person?',
            ),
            answer: L(
              'بله، نمایشگاه ما در ساعات کاری پذیرای شماست.',
              'Yes, our showroom is open during business hours.',
            ),
          },
          {
            question: L(
              'سفارش عمده تخفیف دارد؟',
              'Do bulk orders get a discount?',
            ),
            answer: L(
              'برای سفارش‌های بالای ۵۰ قلم، قیمت ویژه اعلام می‌شود.',
              'Orders above 50 units get special pricing.',
            ),
          },
          {
            question: L(
              'روش‌های پرداخت چیست؟',
              'What payment methods do you accept?',
            ),
            answer: L(
              'انتقال بانکی و چک صیادی برای مشتریان حقوقی.',
              'Bank transfer and certified cheques for corporate customers.',
            ),
          },
          {
            question: L('محصولات اصل هستند؟', 'Are the products genuine?'),
            answer: L(
              'همه اقلام مستقیماً از نمایندگی رسمی سازنده تأمین می‌شوند.',
              'Every item is sourced directly from the manufacturer’s official distributor.',
            ),
          },
        ],
      }),
      section('landing-cta', 'ctaBanner', {
        heading: L('پروژه‌ای در پیش دارید؟', 'Planning a project?'),
        text: L(
          'همین امروز با ما صحبت کنید تا بهترین راه‌حل را پیشنهاد دهیم.',
          'Talk to us today and we will propose the best solution.',
        ),
        cta: { label: L('تماس با ما', 'Contact us'), href: '/contact' },
      }),
      section('landing-ticket', 'ticketForm', {
        heading: L('درخواست مشاوره رایگان', 'Request a free consultation'),
        text: L(
          'شماره خود را بگذارید؛ کارشناسان ما با شما تماس می‌گیرند.',
          'Leave your number and our specialists will call you back.',
        ),
      }),
    ],
  },
  about: {
    seo: {
      title: L('درباره ما', 'About us'),
      description: L(
        'داستان، مأموریت و افتخارات ما',
        'Our story, mission and achievements',
      ),
    },
    sections: [
      section('about-hero', 'aboutHero', {
        image: `${P}/about-hero.svg`,
        title: L('درباره ما', 'About us'),
        subtitle: L(
          'بیش از بیست سال در کنار صنعت ایران',
          'More than twenty years alongside industry',
        ),
      }),
      section('about-intro', 'intro', {
        heading: L('داستان ما', 'Our story'),
        body: L(
          'پارس تجهیز در سال ۱۳۸۲ با هدف تأمین قطعات صنعتی با کیفیت آغاز به کار کرد. امروز با تیمی ۴۰ نفره، به صدها کارخانه و پیمانکار در سراسر کشور خدمت می‌کنیم.',
          'Pars Equipment started in 2003 to supply quality industrial parts. Today, with a team of 40, we serve hundreds of factories and contractors across the country.',
        ),
        image: `${P}/sample-2.svg`,
        imagePosition: 'start',
      }),
      section('about-mission', 'missionVision', {
        mission: {
          title: L('مأموریت ما', 'Our mission'),
          text: L(
            'ساده‌کردن تأمین تجهیزات صنعتی با کیفیت پایدار و خدمات قابل اتکا.',
            'Make sourcing industrial equipment simple, with consistent quality and dependable service.',
          ),
        },
        vision: {
          title: L('چشم‌انداز ما', 'Our vision'),
          text: L(
            'تبدیل‌شدن به اولین انتخاب صنایع منطقه برای تأمین و خدمات فنی.',
            "To be the region's first choice for supply and technical services.",
          ),
        },
        image: `${P}/mission.svg`,
      }),
      section('about-achievements', 'achievements', {
        heading: L('افتخارات و گواهینامه‌ها', 'Achievements and certificates'),
        text: {},
        items: [
          {
            title: L('ISO 9001:2015', 'ISO 9001:2015'),
            text: L(
              'گواهی سیستم مدیریت کیفیت',
              'Quality management certification',
            ),
            year: 2018,
            image: `${P}/certificate-1.svg`,
            icon: '',
          },
          {
            title: L('تأمین‌کننده برتر سال', 'Supplier of the year'),
            text: L(
              'انتخاب‌شده توسط انجمن صنایع فلزی',
              'Selected by the Metal Industries Association',
            ),
            year: 2022,
            image: '',
            icon: 'trophy',
          },
          {
            title: L('عضو اتاق بازرگانی', 'Chamber of commerce member'),
            text: L('عضویت رسمی از سال ۱۳۸۵', 'Official member since 2006'),
            year: 2006,
            image: '',
            icon: 'badge-check',
          },
        ],
      }),
      section('about-cta', 'ctaBanner', {
        heading: L('با ما همکاری کنید', 'Work with us'),
        text: L(
          'برای شروع همکاری همین امروز تماس بگیرید.',
          'Get in touch today to start working together.',
        ),
        cta: { label: L('تماس با ما', 'Contact us'), href: '/contact' },
      }),
    ],
  },
  contact: {
    seo: {
      title: L('تماس با ما', 'Contact us'),
      description: L('راه‌های ارتباط با ما', 'Ways to reach us'),
    },
    sections: [
      section('contact-hero', 'contactHero', {
        image: `${P}/contact-hero.svg`,
        title: L('تماس با ما', 'Contact us'),
        text: L(
          'سوالی دارید یا برای پروژه‌تان مشاوره می‌خواهید؟ از هر راهی که راحت‌ترید با ما در ارتباط باشید.',
          'Have a question or need advice on your project? Reach us whichever way suits you.',
        ),
      }),
      section('contact-info', 'contactInfo', {
        heading: L('راه‌های ارتباطی', 'How to reach us'),
        text: L(
          'در ساعات کاری پاسخگوی شما هستیم.',
          'We answer during business hours.',
        ),
      }),
      section('contact-ticket', 'ticketForm', {
        heading: L('ثبت درخواست', 'Send a request'),
        text: L(
          'فرم را پر کنید تا در اولین فرصت با شما تماس بگیریم.',
          'Fill in the form and we will call you back as soon as possible.',
        ),
      }),
      section('contact-map', 'map', {
        embedUrl: '',
        address: L('تهران، خیابان ولیعصر، پلاک ۱۲۳', '123 Valiasr St., Tehran'),
      }),
    ],
  },
  catalog: {
    seo: {
      title: L('محصولات و خدمات', 'Products and services'),
      description: L('فهرست محصولات و خدمات ما', 'Our products and services'),
    },
    sections: [],
  },
};

/** Creates every page with its sections. A page that already has sections is left untouched. */
export const seedPages = async (): Promise<void> => {
  for (const [key, def] of Object.entries(PAGES) as [
    PageKey,
    (typeof PAGES)[PageKey],
  ][]) {
    const existing = await Page.findOne({ key });
    if (
      existing &&
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
    console.log(`✅ Seeded page "${key}" with ${sections.length} sections`);
  }
};
