import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl; // Extraemos el pathname para que sea más limpio

  // 1. REDIRECCIÓN DE RAÍZ: Si entra a /admin a secas, mandarlo a properties
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/properties', request.url));
  }

  // 2. PROTECCIÓN DE RUTAS: Si intenta ir a cualquier parte de /admin (excepto login)
  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      // El token es válido, lo dejamos pasar
      return NextResponse.next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Si el token expiró o es falso, al login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};