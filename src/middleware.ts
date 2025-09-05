import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "./utils/jwt";

export async function middleware(request: NextRequest) {
    
    const token = request.cookies.get('token')?.value;
    // console.log('Token from middleware:', token);
    
    const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup');

    if (isProtectedRoute) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('user');
      return response;
    }

    try {
      const payload = await jwtVerify(token);
      if (!payload) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        response.cookies.delete('user');
        return response;
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('user');
      return response;
    }

  } else {
    console.log('Public route accessed:', request.nextUrl.pathname);
    if (token) {
      try {
        const payload = await jwtVerify(token);
        console.log('Payload on public route:', payload);
        if (payload) {
          return NextResponse.redirect(new URL('/tasks', request.url));
        }
      } catch (error) {
        console.error('JWT verification failed on public route:', error);
      }
    }
  }

  return NextResponse.next();

}

export const config = {
    matcher: ['/dashboard/:path*', '/tasks/:path*','/login', '/signup'],
    runtime: 'nodejs',
};

// user localstorage of other websites present in the browser sighup page confused 
// and sent user without token in to tasks page then that tasks page sent the user to login page. 
// this cycle doesn't allow user to signup page so be carefully to solve this
