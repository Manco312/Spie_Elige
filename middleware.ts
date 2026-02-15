import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin-panel") && pathname !== "/admin-panel/login") {
    const isAdmin = request.cookies.get("is_spie_admin")?.value;
    if (isAdmin !== "true") {
      return NextResponse.redirect(new URL("/admin-panel/login", request.url));
    }
  }

  // Protect voter routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/vote")) {
    const voterId = request.cookies.get("voter_id")?.value;
    if (!voterId) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-panel/:path*", "/dashboard/:path*", "/vote/:path*"],
};
