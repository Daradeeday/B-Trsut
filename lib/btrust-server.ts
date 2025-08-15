// lib/btrust-server.ts
// ❌ อย่าใส่ "use client"
import { createPublicClient, http } from "viem"
import { mainnet, sepolia } from "viem/chains"

// เลือก chain จาก ENV ตามที่คุณใช้จริง
const CHAIN =
  (process.env.CHAIN_ID === "1" ? mainnet : sepolia)

// ตั้ง RPC URL ฝั่ง server (ไม่ต้องเป็น NEXT_PUBLIC_)
const RPC_URL =
  process.env.RPC_URL ||
  process.env.ALCHEMY_HTTP_URL ||
  process.env.INFURA_HTTP_URL

export function serverPublicClient() {
  return createPublicClient({
    chain: CHAIN,
    transport: RPC_URL ? http(RPC_URL) : http(),
  })
}
