import type { Metadata } from 'next';
import AdminProviders from '@/features/admin/AdminProviders';

/** The back office is never indexed. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: { absolute: 'Admin' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
