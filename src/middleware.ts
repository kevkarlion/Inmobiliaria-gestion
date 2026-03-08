import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getRedirectUrl(request: NextRequest): string | null {
  const url = request.nextUrl;
  const host = request.headers.get('host') || '';
  const protocol = request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '');

  const isHttps = protocol === 'https';
  const isWww = host.startsWith('www.');

  const isLocalhost =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    process.env.NODE_ENV === 'development';

  // 🚫 Nunca redireccionar en desarrollo
  if (isLocalhost) return null;

  let targetUrl: string | null = null;

  if (!isHttps) {
    targetUrl = `https://${host}${url.pathname}${url.search}`;
  } else if (isWww) {
    const nonWwwHost = host.replace(/^www\./, '');
    targetUrl = `https://${nonWwwHost}${url.pathname}${url.search}`;
  }

  return targetUrl;
}

export async function middleware(request: NextRequest) {
  const redirectUrl = getRedirectUrl(request);

  if (redirectUrl) {
    const status = process.env.NODE_ENV === 'production' ? 301 : 307;
    return NextResponse.redirect(redirectUrl, status);
  }

  const token = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // 🔹 Si entra a /admin → redirigir a propiedades
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/properties', request.url));
  }

  // 🔹 Proteger rutas admin
  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|og-image.png).*)',
  ],
};