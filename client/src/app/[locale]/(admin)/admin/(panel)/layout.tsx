import AdminShell from '@/features/admin/AdminShell';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
