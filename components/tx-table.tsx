"use client"
import { useRequestsLive } from "@/lib/requests"
import type { RequestRow } from "@/lib/types"

export function TxTable({ onViewDetails }: { onViewDetails: (r: RequestRow) => void }) {
  const { data, isLoading, isError, error } = useRequestsLive()
  const rows: RequestRow[] = Array.isArray(data) ? data : []

  if (isLoading) return <div className="p-4 text-sm text-muted-foreground">กำลังโหลดธุรกรรม...</div>
  if (isError)   return <div className="p-4 text-sm text-destructive">โหลดธุรกรรมล้มเหลว: {String(error ?? "")}</div>

  return (
    <div className="divide-y rounded-md border">
      {rows.length === 0 && (
        <div className="p-4 text-sm text-muted-foreground">ยังไม่มีคำขอ</div>
      )}

      {rows.map((r) => (
        <button
          key={r.id}
          className="w-full text-left p-4 hover:bg-accent/40"
          onClick={() => onViewDetails(r)}
        >
          {/* ใส่คอลัมน์ตามแบบของคุณ */}
          <div className="flex items-center justify-between">
            <div className="font-medium">{r.description}</div>
            <div className="text-xs opacity-70">{r.amountEth} ETH</div>
          </div>
        </button>
      ))}
    </div>
  )
}
