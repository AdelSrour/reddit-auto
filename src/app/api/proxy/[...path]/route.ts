import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const maxDuration = 300;

const BACKEND_URL = process.env.API_URL || 'http://localhost:3000';

async function handleProxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { path } = await context.params;
    const targetPath = path.join('/');

    const searchParams = request.nextUrl.searchParams.toString();

    const targetUrl = `${BACKEND_URL}/${targetPath}${
      searchParams ? `?${searchParams}` : ''
    }`;

    const headers = new Headers();
    const allowedHeaders = [
      'referer',
      'user-agent',
      'content-type',
      'content-disposition',
    ];
    request.headers.forEach((value, key) => {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    const clientIp = request.headers.get('x-forwarded-for');
    if (clientIp) {
      headers.set('x-client-ip', clientIp);
    }

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

    const body =
      request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.arrayBuffer()
        : undefined;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from the backend' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return handleProxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return handleProxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return handleProxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return handleProxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return handleProxyRequest(request, context);
}
