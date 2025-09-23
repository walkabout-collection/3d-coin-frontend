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
  console.log("Token:", token);

  if (token) {
    try {
      const payload = jwtDecode<TokenPayload>(token);
      console.log("Payload:", payload);

      // 2️⃣ If token expired, clear it
      // if (payload.exp && Date.now() >= payload.exp * 1000) {
      //   console.log("Token expired, clearing cookie");
      //   return NextResponse.redirect(new URL("/login", req.url));
      // }

      // 3️⃣ Redirect logged-in users away from login/signup
      if (
        (pathname.startsWith("/login") || pathname.startsWith("/signup")) &&
        payload.role
      ) {
        const redirectPath = payload.role === "ADMIN" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }

      // 4️⃣ Role-based access control
      if (payload.role === "USER" && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (payload.role === "ADMIN" && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } catch (err) {
      // invalid token
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon.ico")
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
};
