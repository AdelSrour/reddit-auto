import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const BACKEND_URL = process.env.API_URL ?? 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ actionId: string }> },
): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { actionId } = await context.params;
  const targetUrl = `${BACKEND_URL}/actions/stream/${actionId}`;

  const headers = new Headers();
  headers.set('Accept', 'text/event-stream');

  const sessionJwtToken = await getToken({
    req: {
      headers: request.headers,
      cookies: request.cookies,
    } as Parameters<typeof getToken>[0]['req'],
    raw: true,
  });
  if (sessionJwtToken) {
    headers.set('Authorization', `Bearer ${sessionJwtToken}`);
  }

  const response = await fetch(targetUrl, { headers });

  if (!response.ok || response.body === null) {
    const text = await response.text();
    return new Response(text || 'Stream unavailable', { status: response.status });
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
