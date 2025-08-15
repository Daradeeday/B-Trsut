// app/api/auth/nonce/route.ts
import { NextResponse } from "next/server"
import { generateNonce } from "siwe"
export const dynamic = "force-dynamic"

export async function GET() {
  const nonce = generateNonce()
  const res = NextResponse.json({ nonce }, { headers: { "Cache-Control": "no-store" } })
  res.cookies.set("siwe_nonce", nonce, {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 5,
  })
  return res
}
