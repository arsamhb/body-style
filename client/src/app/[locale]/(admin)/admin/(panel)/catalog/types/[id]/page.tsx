import TypeEditorScreen from '@/features/admin/catalog/TypeEditorScreen';

export default async function AdminCatalogTypeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TypeEditorScreen id={id} />;
}
