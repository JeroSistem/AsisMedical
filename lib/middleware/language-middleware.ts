import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware para forzar el uso del idioma español
 */
export function enforceSpanishLanguage(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  
  // Verificar si la URL ya tiene el locale español
  if (pathname.startsWith('/es/') || pathname === '/es') {
    return null; // Ya está en español, continuar
  }
  
  // Si la URL no tiene locale, redirigir a español
  if (!pathname.startsWith('/api/') && 
      !pathname.startsWith('/_next/') && 
      !pathname.startsWith('/favicon.ico') &&
      !pathname.includes('.')) {
    
    const url = request.nextUrl.clone();
    url.pathname = `/es${pathname}`;
    return NextResponse.redirect(url);
  }
  
  return null;
}

/**
 * Middleware para establecer headers de idioma
 */
export function setLanguageHeaders(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  
  // Establecer headers para forzar español
  response.headers.set('Accept-Language', 'es,es-CO;q=0.9');
  response.headers.set('Content-Language', 'es');
  
  return response;
}

/**
 * Middleware combinado para manejo de idioma
 */
export function languageMiddleware(request: NextRequest): NextResponse | null {
  // Primero verificar si necesitamos redirigir
  const redirect = enforceSpanishLanguage(request);
  if (redirect) {
    return redirect;
  }
  
  // Luego establecer headers
  return setLanguageHeaders(request);
}
