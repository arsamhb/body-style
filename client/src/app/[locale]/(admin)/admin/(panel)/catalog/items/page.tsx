import { Suspense } from 'react';
import ItemsScreen from '@/features/admin/catalog/ItemsScreen';
import Loading from '@/shared/UI/Loading';

export default function AdminCatalogItemsPage() {
  return (
    <Suspense fallback={<Loading size="md" />}>
      <ItemsScreen />
    </Suspense>
  );
}
