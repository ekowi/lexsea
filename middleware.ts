import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/account")) {
    const token = request.cookies.get("ls_session")?.value;
    if (!token) {
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(pathname)}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
