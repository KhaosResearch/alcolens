import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  // Debug: Ver en terminal si se ejecuta
  // console.log("🔒 Middleware ejecutándose en:", req.nextUrl.pathname);

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // --- REGLA 1: ZONA PÚBLICA DE AUTH (Login/Register) ---
  if (pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/doctor/dashboard', req.url));
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