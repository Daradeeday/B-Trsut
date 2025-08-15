"use client"
import useSWR from "swr"

const fetcher = (url:string)=>fetch(url).then(r=>r.json())

export function StatCards() {
  const { data, error, isLoading } = useSWR("/api/stats", fetcher, { refreshInterval: 15_000 })

  const skeleton = (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="h-40 rounded-xl bg-muted/20 animate-pulse" />
      <div className="h-40 rounded-xl bg-muted/20 animate-pulse" />
      <div className="h-40 rounded-xl bg-muted/20 animate-pulse" />
    </div>
  )
  if (isLoading) return skeleton
  if (error || !data) return <div className="text-red-500">โหลดสถิติล้มเหลว</div>

  const deltaText = data.deltas?.totalRequestsMoM == null
    ? "—"
    : `${data.deltas.totalRequestsMoM > 0 ? "+" : ""}${data.deltas.totalRequestsMoM}% จากเดือนที่แล้ว`

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* คำขอทั้งหมด */}
      <div className="rounded-2xl bg-black/60 border p-6">
        <div className="text-sm text-muted-foreground">คำขอทั้งหมด</div>
        <div className="mt-4 text-4xl font-bold">{data.totalRequests}</div>
        <div className="mt-2 text-emerald-400 text-sm">↑ {deltaText}</div>
      </div>

      {/* รอการอนุมัติ */}
      <div className="rounded-2xl bg-black/60 border p-6">
        <div className="text-sm text-muted-foreground">รอการอนุมัติ</div>
        <div className="mt-4 text-4xl font-bold">{data.pendingCount}</div>
        <div className="mt-2 text-yellow-500 text-sm">• คำขอที่รอการพิจารณา</div>
      </div>

      {/* อนุมัติแล้ว (ETH) */}
      <div className="rounded-2xl bg-black/60 border p-6">
        <div className="text-sm text-muted-foreground">อนุมัติแล้ว</div>
        <div className="mt-4 text-4xl font-bold">{Number(data.approvedAmountEth).toFixed(2)} ETH</div>
        <div className="mt-2 text-emerald-400 text-sm">✓ ยอดเงินที่อนุมัติแล้ว</div>
      </div>
    </div>
  )
}
