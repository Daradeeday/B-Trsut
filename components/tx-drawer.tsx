"use client"
import { Button } from "@/components/ui/button"
import { useBTrust } from "@/lib/btrust"
import type { RequestRow } from "@/lib/types"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export function TxDrawer({ request, open, onClose }:{
  request: RequestRow | null, open: boolean, onClose: ()=>void
}) {
  const { castVote, finalize } = useBTrust()
  const [busy, setBusy] = useState(false)
  const qc = useQueryClient()
  if (!open || !request) return null

  async function vote(support: boolean) {
    if (!request) return;
    try {
      setBusy(true)
      await castVote(request.id, support)
      await qc.invalidateQueries({ queryKey: ["requests"] })
      onClose()
      alert("ส่งโหวตเรียบร้อย")
    } catch (e:any) {
      alert(e?.shortMessage || e?.message || "โหวตไม่สำเร็จ")
    } finally { setBusy(false) }
  }

  async function doFinalize(approve: boolean) {
    if (!request) return;
    try {
      setBusy(true)
      await finalize(request.id, approve)
      await qc.invalidateQueries({ queryKey: ["requests"] })
      onClose()
      alert("ปิดคำขอแล้ว")
    } catch (e:any) {
      alert(e?.shortMessage || e?.message || "ไม่สำเร็จ")
    } finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center">
      <div className="w-[520px] rounded-md bg-background p-5 shadow-lg">
        <div className="mb-2 text-lg font-semibold">คำขอ #{request.id}</div>
        <div className="text-sm text-muted-foreground mb-4">{request.description}</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={()=>vote(true)} disabled={busy}>โหวตเห็นชอบ</Button>
          <Button variant="outline" onClick={()=>vote(false)} disabled={busy}>โหวตไม่เห็นชอบ</Button>
          <div className="ml-auto" />
          <Button onClick={()=>doFinalize(true)} disabled={busy}>อนุมัติจ่าย</Button>
          <Button variant="destructive" onClick={()=>doFinalize(false)} disabled={busy}>ปฏิเสธ</Button>
        </div>
        <div className="mt-4 text-right">
          <Button variant="ghost" onClick={onClose}>ปิด</Button>
        </div>
      </div>
    </div>
  )
}
