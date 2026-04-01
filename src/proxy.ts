import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isPublicApiRoute = isApiRoute && (request.nextUrl.pathname.startsWith("/api/auth"));

  // If user is not authenticated and trying to access a protected route
  if (!token && !isAuthRoute && !isPublicApiRoute && request.nextUrl.pathname !== "/") {
    // For API routes, return 401
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and trying to access auth routes
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
