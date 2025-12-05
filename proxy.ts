import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  // Debug: Ver en terminal si se ejecuta
  const secret = process.env.NEXTAUTH_SECRET;
  console.log("🔒 Middleware: Secret loaded?", !!secret, secret?.substring(0, 5));

  const allCookies = req.cookies.getAll();

  const tokenCookie = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');

  let session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Fallback: If session is null but we have a secure cookie, try forcing the name
  if (!session && req.cookies.get('__Secure-next-auth.session-token')) {
    session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: '__Secure-next-auth.session-token'
    });
    console.log("🔓 Session decoded (fallback):", session);
  }

  const { pathname } = req.nextUrl;

  // --- REGLA 1: ZONA PÚBLICA DE AUTH (Login/Register) ---
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/doctor', req.url));
  }

  // --- REGLA 2: ZONA PROTEGIDA (Doctor) ---
  if (pathname.startsWith('/doctor')) {

    // CASO A: No está logueado
    if (!session) {
      const url = new URL('/auth/login', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // CASO B: Está logueado pero NO es médico
    // (Asegúrate de que tu callback JWT esté guardando el rol correctamente)
    if (session.role !== 'doctor') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

// Configuración: MATCH ALL (Ejecutar en todo excepto estáticos)
// Esta es la configuración más segura para evitar fugas.
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de solicitud excepto las que comienzan con:
     * - api (rutas API)
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};