import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware-client';

export async function middleware(request: NextRequest) {
  console.log('middleware hit:', request.nextUrl.pathname);
  let response = NextResponse.next();

  const supabase = createSupabaseMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isAuthRoute =
    path.startsWith('/login') ||
    path.startsWith('/signup') ||
    path.startsWith('/reset');

  const isProtectedRoute = path.startsWith('/dashboard');

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (path === '/') {
    return NextResponse.redirect(
      new URL(user ? '/dashboard' : '/login', request.url),
    );
  }

  return response;
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/signup', '/reset'],
};
