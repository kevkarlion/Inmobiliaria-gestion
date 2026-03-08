import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  // 🔹 Redirigir /admin → /admin/properties
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/properties', request.url));
  }

  // 🔹 Proteger rutas /admin (excepto /login)
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

  // 🔹 Para todas las demás rutas, dejar pasar normalmente
  return NextResponse.next();
}

// 🔹 Se aplica a todas las rutas excepto API, _next y assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|og-image.png).*)',
  ],
};