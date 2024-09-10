import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // Exclude /login from the middleware check
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", request.url);

    return NextResponse.redirect(loginUrl);
  }

  // If the user is already logged in, redirect to the home page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If there's a session, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|mode-mobile-logo.png|starship).*)",
  ],
};
