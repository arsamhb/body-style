import { Settings } from '../../modules/settings/settings.model';
import { invalidateSettingsCache } from '../../modules/settings/settings.service';
import { L } from './content';

/**
 * Site chrome: name, navigation, footer, contact ways, SEO. Only seeds when the site has no name.
 * Slogan, footer text and contact details come from bodystyleco.com (about and contact pages);
 * the share image is still missing.
 */
export const seedSettings = async (): Promise<void> => {
  const existing = await Settings.findOne({ key: 'site' });
  if (existing && existing.siteName.size > 0) {
    console.log('ℹ️  Settings already seeded — skipping.');
    return;
  }

  await Settings.findOneAndUpdate(
    { key: 'site' },
    {
      $set: {
        // The brand as printed on the machines in the client photos ("BODY STYLE").
        siteName: L('بادی استایل', 'Body Style'),
        // From the site title: "تولیدکننده دستگاه‌های بدنسازی خانگی و باشگاهی با ضمانت اصلی".
        slogan: L(
          'تولیدکننده دستگاه‌های بدنسازی خانگی و باشگاهی با ضمانت اصلی',
          'Manufacturer of home and commercial fitness equipment with an original warranty',
        ),
        // Empty on purpose: the site falls back to the built-in mark at /img/logo/logo.png and the
        // favicon is app/icon.png. Upload in the admin panel to override the logo.
        logoUrl: '',
        logoDarkUrl: '',
        faviconUrl: '',
        enabledLocales: ['fa', 'en'],
        navbar: [
          {
            id: 'nav-home',
            label: L('خانه', 'Home'),
            href: '/',
            order: 0,
            enabled: true,
          },
          {
            id: 'nav-products',
            label: L('دستگاه‌ها', 'Machines'),
            href: '/catalog/products',
            order: 1,
            enabled: true,
          },
          {
            id: 'nav-about',
            label: L('درباره ما', 'About'),
            href: '/about',
            order: 2,
            enabled: true,
          },
          {
            id: 'nav-contact',
            label: L('تماس با ما', 'Contact'),
            href: '/contact',
            order: 3,
            enabled: true,
          },
        ],
        footer: {
          quickLinks: [
            {
              id: 'ql-home',
              label: L('صفحه اصلی', 'Home'),
              href: '/',
              order: 0,
              enabled: true,
            },
            {
              id: 'ql-products',
              label: L('دستگاه‌ها', 'Machines'),
              href: '/catalog/products',
              order: 1,
              enabled: true,
            },
            {
              id: 'ql-about',
              label: L('درباره ما', 'About us'),
              href: '/about',
              order: 2,
              enabled: true,
            },
            {
              id: 'ql-contact',
              label: L('ارتباط با ما', 'Contact us'),
              href: '/contact',
              order: 3,
              enabled: true,
            },
          ],
          text: L(
            'شرکت بادی استایل یکی از تولیدکنندگان معتبر تجهیزات ورزشی و بدنسازی در کشور است؛ با هدف توسعه فناوری تولید داخلی و ارائه محصولات استاندارد در حوزه فیتنس.',
            'Body Style is a respected domestic manufacturer of sports and bodybuilding equipment, built to advance local production technology and deliver standard products in fitness.',
          ),
          copyright: L('بادی استایل', 'Body Style'),
        },
        // Source: bodystyleco.com/درباره-ما and /تماس-با-ما (footer + contact blocks).
        // The Instagram and Telegram links on that site are broken (`bodystyle.co@`), so no
        // social entries are seeded until the client gives real handles.
        contactWays: [
          {
            id: 'cw-phone',
            type: 'phone',
            icon: 'phone',
            label: L('تلفن شرکت', 'Company phone'),
            value: '02165475042',
            description: L('شماره تماس شرکت', 'Main company line'),
            showInFooter: true,
            order: 0,
          },
          {
            id: 'cw-ceo',
            type: 'phone',
            icon: 'smartphone',
            label: L('مدیرعامل قهرمانی', 'CEO, Ghahremani'),
            value: '09193633323',
            description: L('تماس مستقیم با مدیرعامل', 'Direct line to the CEO'),
            showInFooter: true,
            order: 1,
          },
          {
            id: 'cw-mirzapour',
            type: 'phone',
            icon: 'smartphone',
            label: L('میرزاپور', 'Mirzapour'),
            value: '09124398872',
            description: L('تماس با آقای میرزاپور', 'Contact: Mirzapour'),
            showInFooter: true,
            order: 2,
          },
          {
            id: 'cw-phone-2',
            type: 'phone',
            icon: 'phone',
            label: L('تلفن دوم شرکت', 'Second company line'),
            value: '02165475041',
            description: L('خط دوم شرکت', 'Second company line'),
            showInFooter: false,
            order: 3,
          },
          {
            id: 'cw-mobile-2',
            type: 'phone',
            icon: 'smartphone',
            label: L('موبایل', 'Mobile'),
            value: '09384558191',
            description: L('شماره موبایل', 'Mobile number'),
            showInFooter: false,
            order: 4,
          },
          {
            id: 'cw-email',
            type: 'email',
            icon: 'mail',
            label: L('ایمیل', 'Email'),
            value: 'info@bodystyleco.com',
            description: L('پیام خود را ایمیل کنید', 'Send us an email'),
            showInFooter: true,
            order: 5,
          },
          {
            id: 'cw-address',
            type: 'address',
            icon: 'map-pin',
            label: L('آدرس شرکت بادی استایل', 'Body Style address'),
            value:
              'استان تهران، شهرستان ملارد، ابتدای صفادشت، خیابان آبشار، خیابان بنفشه چهارم غربی، اولین چهارراه سمت چپ',
            description: L(
              'دفتر و کارخانه بادی استایل',
              'Body Style office and factory',
            ),
            showInFooter: true,
            order: 6,
          },
          {
            id: 'cw-hours',
            type: 'hours',
            icon: 'clock',
            label: L('ساعات کاری', 'Working hours'),
            value: 'شنبه تا پنج‌شنبه، ۸ صبح تا ۱۷ بعدازظهر',
            description: L(
              'هفت روز هفته، ۲۴ ساعت شبانه‌روز پاسخگوی شما هستیم',
              'We answer you seven days a week, 24 hours a day',
            ),
            showInFooter: true,
            order: 7,
          },
        ],
        seo: {
          titleTemplate: L('%s | بادی استایل', '%s | Body Style'),
          description: L(
            'شرکت بادی استایل به‌عنوان یکی از تولیدکنندگان معتبر تجهیزات ورزشی و بدنسازی در کشور، فعالیت خود را با هدف توسعه فناوری تولید داخلی و ارائه محصولات استاندارد',
            'Body Style is a respected domestic manufacturer of sports and bodybuilding equipment, built to advance local production technology and deliver standard products.',
          ),
          // MISSING: social share image.
          ogImageUrl: '',
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  invalidateSettingsCache();
  console.log('✅ Seeded site settings');
};
