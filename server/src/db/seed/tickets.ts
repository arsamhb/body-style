import { CatalogItem } from '../../modules/catalog/catalogItem.model';
import { Ticket } from '../../modules/tickets/tickets.model';
import { hashIp } from '../../modules/tickets/tickets.service';

/** A handful of requests from different places on the site so the inbox has something to show. */
export const seedTickets = async (): Promise<void> => {
  if ((await Ticket.countDocuments()) > 0) {
    console.log('ℹ️  Tickets already seeded — skipping.');
    return;
  }
  const motor = await CatalogItem.findOne({ slug: 'motor-3kw' });
  const pump = await CatalogItem.findOne({ slug: 'centrifugal-pump-2' });
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);
  const rows = [
    {
      name: 'علی رضایی',
      phone: '+989121234567',
      message:
        'برای خط تولید جدید ۴ عدد الکتروموتور نیاز داریم. لطفاً قیمت پروژه‌ای اعلام کنید.',
      status: 'new',
      source: {
        page: 'catalogItem',
        section: 'item-request',
        itemId: motor ? String(motor._id) : '',
        itemSlug: 'motor-3kw',
        itemTitle: 'الکتروموتور ۳ کیلووات',
        path: '/catalog/products/motor-3kw',
      },
      createdAt: daysAgo(0),
    },
    {
      name: 'Sara Ahmadi',
      phone: '+15550001234',
      message: 'Do you ship pumps internationally?',
      locale: 'en',
      status: 'new',
      source: {
        page: 'catalogItem',
        section: 'item-request',
        itemId: pump ? String(pump._id) : '',
        itemSlug: 'centrifugal-pump-2',
        itemTitle: 'پمپ سانتریفیوژ ۲ اینچ',
        path: '/en/catalog/products/centrifugal-pump-2',
      },
      createdAt: daysAgo(1),
    },
    {
      name: 'مریم احمدی',
      phone: '09351112233',
      message: 'درخواست مشاوره برای انتخاب اینورتر مناسب.',
      status: 'inProgress',
      adminNote: 'تماس گرفته شد، منتظر لیست تجهیزات.',
      source: {
        page: 'landing',
        section: 'landing-ticket',
        itemId: '',
        itemSlug: '',
        itemTitle: '',
        path: '/',
      },
      createdAt: daysAgo(2),
    },
    {
      name: 'حسین کریمی',
      phone: '02188776655',
      message: 'آیا امکان بازدید حضوری از نمایشگاه هست؟',
      status: 'closed',
      adminNote: 'قرار بازدید سه‌شنبه ساعت ۱۰.',
      source: {
        page: 'contact',
        section: 'contact-ticket',
        itemId: '',
        itemSlug: '',
        itemTitle: '',
        path: '/contact',
      },
      createdAt: daysAgo(4),
    },
    {
      name: 'نیما صادقی',
      phone: '09120009988',
      message: '',
      status: 'new',
      source: {
        page: 'contact',
        section: 'contact-ticket',
        itemId: '',
        itemSlug: '',
        itemTitle: '',
        path: '/contact',
      },
      createdAt: daysAgo(5),
    },
    {
      name: 'زهرا موسوی',
      phone: '09198887766',
      message: 'قیمت تابلو برق سفارشی برای کارگاه ۲۰۰ متری.',
      status: 'closed',
      adminNote: 'پیش‌فاکتور ارسال شد.',
      source: {
        page: 'landing',
        section: 'landing-ticket',
        itemId: '',
        itemSlug: '',
        itemTitle: '',
        path: '/',
      },
      createdAt: daysAgo(9),
    },
  ];
  for (const row of rows) {
    const doc = new Ticket({
      locale: 'fa',
      adminNote: '',
      ...row,
      meta: { ipHash: hashIp('127.0.0.1'), userAgent: 'seed' },
    });
    doc.set({ createdAt: row.createdAt, updatedAt: row.createdAt });
    await doc.save();
  }
  console.log(`✅ Seeded ${rows.length} tickets`);
};
