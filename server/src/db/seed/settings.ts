import { Settings } from '../../modules/settings/settings.model';
import { invalidateSettingsCache } from '../../modules/settings/settings.service';
import { L } from './content';

/** Site chrome: name, navigation, footer, contact ways, SEO. Only seeds when the site has no name. */
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
        siteName: L('پارس تجهیز', 'Pars Equipment'),
        slogan: L(
          'راه‌حل‌های صنعتی قابل اعتماد، از طراحی تا اجرا',
          'Reliable industrial solutions, from design to delivery',
        ),
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
            label: L('محصولات', 'Products'),
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
              id: 'ql-products',
              label: L('محصولات', 'Products'),
              href: '/catalog/products',
              order: 0,
              enabled: true,
            },
            {
              id: 'ql-about',
              label: L('درباره ما', 'About us'),
              href: '/about',
              order: 1,
              enabled: true,
            },
            {
              id: 'ql-faq',
              label: L('سوالات متداول', 'FAQ'),
              href: '/#landing-faq',
              order: 2,
              enabled: true,
            },
            {
              id: 'ql-contact',
              label: L('تماس با ما', 'Contact'),
              href: '/contact',
              order: 3,
              enabled: true,
            },
          ],
          text: L(
            'بیش از دو دهه تجربه در تأمین تجهیزات و خدمات فنی برای صنایع مختلف.',
            'Two decades of supplying equipment and technical services to industry.',
          ),
          copyright: L('پارس تجهیز', 'Pars Equipment'),
        },
        contactWays: [
          {
            id: 'cw-phone',
            type: 'phone',
            icon: 'phone',
            label: L('تلفن', 'Phone'),
            value: '+98 21 1234 5678',
            description: L('شنبه تا چهارشنبه، ۹ تا ۱۷', 'Sat–Wed, 9:00–17:00'),
            showInFooter: true,
            order: 0,
          },
          {
            id: 'cw-email',
            type: 'email',
            icon: 'mail',
            label: L('ایمیل', 'Email'),
            value: 'info@example.com',
            description: L(
              'پاسخ در کمتر از یک روز کاری',
              'Replies within one business day',
            ),
            showInFooter: true,
            order: 1,
          },
          {
            id: 'cw-whatsapp',
            type: 'whatsapp',
            icon: 'message-circle',
            label: L('واتس‌اپ', 'WhatsApp'),
            value: '+98 912 000 0000',
            description: L(
              'پشتیبانی سریع پیام‌رسان',
              'Quick messenger support',
            ),
            showInFooter: true,
            order: 2,
          },
          {
            id: 'cw-address',
            type: 'address',
            icon: 'map-pin',
            label: L('آدرس', 'Address'),
            value: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
            description: L('دفتر مرکزی و نمایشگاه', 'Head office and showroom'),
            showInFooter: true,
            order: 3,
          },
        ],
        seo: {
          titleTemplate: L('%s | پارس تجهیز', '%s | Pars Equipment'),
          description: L(
            'راه‌حل‌های صنعتی قابل اعتماد، از طراحی تا اجرا',
            'Reliable industrial solutions, from design to delivery',
          ),
          ogImageUrl: '',
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  invalidateSettingsCache();
  console.log('✅ Seeded site settings');
};
