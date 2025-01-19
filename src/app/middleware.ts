// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/api/auth/instagram/callback'
  ]

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Allow access to public paths and static files
  if (isPublicPath || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Check for authentication token
  const authToken = request.cookies.get('auth_token')

  // Redirect to login if no token is present
  if (!authToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}