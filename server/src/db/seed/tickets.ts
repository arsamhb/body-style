import { CatalogItem } from '../../modules/catalog/catalogItem.model';
import { Ticket } from '../../modules/tickets/tickets.model';
import { hashIp } from '../../modules/tickets/tickets.service';

/** A handful of requests from different places on the site so the inbox has something to show. */
export const seedTickets = async (): Promise<void> => {
  if ((await Ticket.countDocuments()) > 0) {
    console.log('ℹ️  Tickets already seeded — skipping.');
    return;
  }
  const smith = await CatalogItem.findOne({ slug: 'smith' });
  const press = await CatalogItem.findOne({ slug: 'chest-press' });
  const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);
  const rows = [
    {
      name: 'علی رضایی',
      phone: '+989121234567',
      message:
        'برای تجهیز باشگاه به دستگاه اسمیت نیاز داریم. لطفاً قیمت را اعلام کنید.',
      status: 'new',
      source: {
        page: 'catalogItem',
        section: 'item-request',
        itemId: smith ? String(smith._id) : '',
        itemSlug: 'smith',
        itemTitle: 'اسمیت',
        path: '/catalog/products/smith',
      },
      createdAt: daysAgo(0),
    },
    {
      name: 'Sara Ahmadi',
      phone: '+15550001234',
      message: 'Do you ship the chest press, and what is the price?',
      locale: 'en',
      status: 'new',
      source: {
        page: 'catalogItem',
        section: 'item-request',
        itemId: press ? String(press._id) : '',
        itemSlug: 'chest-press',
        itemTitle: 'پرس سینه',
        path: '/en/catalog/products/chest-press',
      },
      createdAt: daysAgo(1),
    },
    {
      name: 'مریم احمدی',
      phone: '09351112233',
      message: 'برای انتخاب بین پرس سینه و پرس سینه همگرا مشاوره می‌خواهم.',
      status: 'inProgress',
      adminNote: 'تماس گرفته شد، منتظر فهرست دستگاه‌های باشگاه.',
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
      message: 'قیمت ست دستگاه برای یک باشگاه کوچک.',
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
