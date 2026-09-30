import { Suspense } from 'react';
import ItemEditorScreen from '@/features/admin/catalog/ItemEditorScreen';
import Loading from '@/shared/UI/Loading';

export default async function AdminCatalogItemEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading size="md" />}>
      <ItemEditorScreen id={id} />
    </Suspense>
  );
}
