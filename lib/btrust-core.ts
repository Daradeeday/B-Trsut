import type { PublicClient } from "viem"
import { CONTRACT, ONCHAIN, abi } from "./btrust-shared" // ปรับ path ให้ตรงของคุณ

export function watchCreatedWithClient(
  client: PublicClient,
  onLogs: (logs: any[]) => void
) {
  if (!ONCHAIN) return () => {}
  return client.watchContractEvent({
    address: CONTRACT,
    abi,
    eventName: "Created", // ปรับชื่อตาม ABI จริง
    onLogs,
  })
}