import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get('crm_auth')
  const { pathname } = request.nextUrl

  if (!authCookie && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (authCookie && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
