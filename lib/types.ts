export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Finalized"

export interface RequestRow {
  id: number
  description: string
  amountEth: string
  requester: `0x${string}`
  status: RequestStatus
  createdAt?: string
  txHash?: `0x${string}`
  blockNumber?: number
  network?: "Sepolia" | "Amoy" | "Unknown"
}