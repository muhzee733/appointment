import { NextRequest, NextResponse } from 'next/server';

export function middleware(req) {
  const isAuth = req.cookies.get('isAuth'); // Get authentication value

  // Allow access to the default page (e.g., home page) without authentication
  if (req.nextUrl.pathname === '/') {
    return NextResponse.next(); // Proceed to the default page without authentication check
  }

  // Check if the cookie exists and contains a Gmail address
  if (isAuth) {
    if (!isAuth.value.includes('gmail.com')) {
      const response = NextResponse.redirect(new URL('/auth/sign-in', req.url));
      response.cookies.set('authError', 'You Got an Issue on your Account Kindly Contact Admin.', { path: '/' });
      return response;
    }
  }

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];

  // If the user is not authenticated and tries to access a protected route, redirect to sign-in
  if (protectedRoutes.includes(req.nextUrl.pathname) && !isAuth) {
    const response = NextResponse.redirect(new URL('/auth/sign-in', req.url));
    response.cookies.set('authError', 'You must be logged in to access this page', { path: '/' });
    return response;
  }

  return NextResponse.next();
}

// Define protected routes for the matcher
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
};
