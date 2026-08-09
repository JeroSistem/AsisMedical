import { NextResponse } from 'next/server'

// Auth desactivada: permitir todas las rutas sin verificación
export default function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)']
}
