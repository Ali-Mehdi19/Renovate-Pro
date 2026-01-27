// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Example using Next-Auth

export async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // 1. Redirect unauthenticated users to login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Role-Based Redirection (RBAC)
  const userRole = token?.role;

  if (pathname.startsWith('/surveyor') && userRole !== 'Surveyor') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  if (pathname.startsWith('/planner') && userRole !== 'Planner') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/customer/:path*', '/surveyor/:path*', '/planner/:path*'],
};