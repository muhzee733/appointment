import { NextRequest, NextResponse } from 'next/server';

export function middleware(req) {
  const isAuth = req.cookies.get('isAuth'); // Get authentication value

  // Check if the cookie exists and contains a Gmail address
  if (isAuth) {
    if (!isAuth.value.includes('gmail.com')) {
      const response = NextResponse.redirect(new URL('/auth/sign-in', req.url));
      response.cookies.set('authError', 'You Got a Issue on your Account Kindly Contact Admin.', { path: '/' });
      return response;
    }
  }
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !isAuth) {
    const response = NextResponse.redirect(new URL('/auth/sign-in', req.url));
    response.cookies.set('authError', 'You must be logged in to access this page', { path: '/' });
    return response;
  }

  return NextResponse.next();
}

// Define protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
};
