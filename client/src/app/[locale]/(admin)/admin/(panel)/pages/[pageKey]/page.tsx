import { notFound } from 'next/navigation';
import PageEditorScreen from '@/features/admin/pages/PageEditorScreen';
import { PAGE_KEYS, type PageKey } from '@/features/site/types';

export default async function AdminPageEditorPage({
  params,
}: {
  params: Promise<{ pageKey: string }>;
}) {
  const { pageKey } = await params;
  if (!(PAGE_KEYS as readonly string[]).includes(pageKey)) notFound();
  return <PageEditorScreen pageKey={pageKey as PageKey} />;
}
