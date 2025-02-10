import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Check if we're on an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!userData?.is_admin) {
      // Redirect non-admin users to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 