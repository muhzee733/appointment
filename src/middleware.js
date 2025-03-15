import { NextRequest, NextResponse } from 'next/server';

export function middleware(req) {
  const isAuth = req.cookies.get('isAuth');
  const token = Cookies.get('isAuth');
  console.log(token, 'token');
  console.log(isAuth, 'isAuth');
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !isAuth) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
};
