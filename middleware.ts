import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  const isLogin = pathname === '/login'
  const isAuthApi = pathname.startsWith('/api/auth')
  const isApi = pathname.startsWith('/api/')

  // Login siempre limpio: /login (sin query)
  if (isLogin && searchParams.toString()) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLogin || isAuthApi) {
    if (isLogin) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      })
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    // APIs y Server Actions: JSON 401 (no redirigir a HTML de login;
    // si no, el cliente se queda en "Guardando..." sin respuesta usable)
    const isServerAction = req.headers.has('next-action')
    if (isApi || isServerAction) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
