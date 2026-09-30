// Liveness probe for the web container, used by the compose healthcheck (deploy/compose.prod.yml).
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ status: 'ok' });
}
