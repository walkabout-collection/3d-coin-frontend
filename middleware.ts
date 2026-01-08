import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface TokenPayload {
  role?: "USER" | "ADMIN";
  exp?: number;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1️⃣ Read JWT token from cookies
  const token = req.cookies.get("token")?.value;

  // 2️⃣ Allow public routes without authentication
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    // If user is already logged in, redirect away from login/signup
    if (
      token &&
      (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    ) {
      try {
        const payload = jwtDecode<TokenPayload>(token);
        if (payload.role) {
          const redirectPath =
            payload.role === "ADMIN" ? "/admin" : "/dashboard";
          return NextResponse.redirect(new URL(redirectPath, req.url));
        }
      } catch (err) {
        // Invalid token, allow access to login/signup
      }
    }
    return NextResponse.next();
  }

  // 3️⃣ Protect admin routes - require authentication and ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const payload = jwtDecode<TokenPayload>(token);

      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Require ADMIN role for admin routes
      if (payload.role !== "ADMIN") {
        // Redirect non-admin users to their appropriate dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (err) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 4️⃣ Protect dashboard routes - require authentication
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const payload = jwtDecode<TokenPayload>(token);

      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Redirect ADMIN users away from user dashboard
      if (payload.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } catch (err) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
};
