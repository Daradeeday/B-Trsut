// lib/btrust-shared.ts
import RAW from "@/lib/abi/BTrust.json"
import type { Abi, Address } from "viem"

// ABI
export const abi: Abi = (((RAW as any).abi ?? RAW) as Abi)

// Address (อ่านได้ทั้งฝั่ง server/client)
const CONTRACT_ENV =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  process.env.BTRUST_ADDRESS || // กันเคสเดิมที่เคยตั้งชื่อแบบนี้
  ""

export const CONTRACT = (CONTRACT_ENV || "0x0000000000000000000000000000000000000000") as Address
export const ONCHAIN = !!CONTRACT_ENV

// เพื่อความเข้ากันได้กับชื่อเก่า
export const BTRUST_ADDRESS = CONTRACT
