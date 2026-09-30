import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

/**
 * Called by the API after content writes: `POST /api/revalidate` with `Authorization: Bearer
 * <REVALIDATE_SECRET>` and `{ tags: string[] }`. Tags must match the ones used in `publicFetch`.
 */
const TAG = /^[a-z]+(:[a-z0-9-]+)*$/i;

const secretMatches = (header: string | null): boolean => {
  const secret = process.env.REVALIDATE_SECRET ?? '';
  const provided = header?.replace(/^Bearer\s+/i, '') ?? '';
  if (!secret || provided.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(secret));
};

export async function POST(request: Request) {
  if (!secretMatches(request.headers.get('authorization'))) {
    return NextResponse.json(
      { error: { code: 'NOT_AUTHENTICATED', message: 'Bad secret' } },
      { status: 401 }
    );
  }
  let body: { tags?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Invalid JSON' } },
      { status: 400 }
    );
  }
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string' && TAG.test(t))
    : [];
  // `{ expire: 0 }` purges immediately; the 'max' profile would serve stale once (SWR).
  for (const tag of tags.slice(0, 50)) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: tags, at: Date.now() });
}
