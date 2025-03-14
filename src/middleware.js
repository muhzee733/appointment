import { NextResponse } from 'next/server';

export function middleware(request) {
  let cookie = request.cookies.get('isAuth');
  let isAuth = cookie.value;
  if (isAuth) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
