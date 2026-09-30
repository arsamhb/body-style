import TicketDetailScreen from '@/features/admin/tickets/TicketDetailScreen';

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TicketDetailScreen id={id} />;
}
