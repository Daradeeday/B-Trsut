import { NextResponse } from "next/server"

// ป้องกันไม่ให้ข้อมูลถูกเก็บแคช
export const dynamic = "force-dynamic"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  // เคลียร์ token และ nonce ที่เคยถูกใช้งานแล้ว
  res.cookies.set("btrust_token", "", { path: "/", maxAge: 0 })
  res.cookies.delete("siwe_nonce")
  return res
}

// รองรับการเรียกผ่าน GET ด้วย
export async function GET() {
  return POST()
}
