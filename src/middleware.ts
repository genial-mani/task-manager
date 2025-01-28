import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "./utils/jwt";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const payload = await jwtVerify(token);
        if (!payload) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/tasks/:path*"],
};
