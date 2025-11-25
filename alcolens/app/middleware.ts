import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/register', '/invite'];

  // Si el usuario está intentando acceder a rutas públicas y ya está autenticado,
  // redirigir a home (excepto /invite que siempre es accesible)
  if (isLoggedIn && ['/login', '/register'].includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Si el usuario NO está autenticado e intenta acceder a rutas protegidas,
  // redirigir a login
  if (!isLoggedIn && !publicRoutes.includes(pathname) && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
