import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "./utils/jwt";

export async function middleware(request: NextRequest) {
    
    const token = request.cookies.get('token')?.value;
    // console.log('Token from middleware:', token);
    
    const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login');

    if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await jwtVerify(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

  } else {
    const payload = await jwtVerify(token as string);
    if (token && payload) {
      return NextResponse.redirect(new URL('/tasks', request.url));
    }
  }

  return NextResponse.next();

}

export const config = {
    matcher: ['/dashboard/:path*', '/tasks/:path*','/login'],
    runtime: 'nodejs',
};
