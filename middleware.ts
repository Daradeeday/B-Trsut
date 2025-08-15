import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("btrust_token")?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/auth"
    // ส่ง path เดิมไปเป็น query เผื่ออยากพากลับหลังล็อกอิน
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

// ใส่เฉพาะเส้นทางที่ “ต้องล็อกอิน”
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vote/:path*",
    "/approve-voting/:path*",
    "/withdraw/:path*",
    "/expenses/:path*",
    "/roles/:path*",
  ],
}
