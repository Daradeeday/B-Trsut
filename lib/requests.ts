"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { RequestRow } from "@/lib/types"
import { useBTrust } from "@/lib/btrust"

export type UseRequestsResult = {
  data: RequestRow[]
  isLoading: boolean
  isError: boolean
  error?: unknown
}

export function useRequestsLive(pollMs = 5_000): UseRequestsResult {
  const [data, setData] = useState<RequestRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const isMounted = useRef(true)

  // --- เสถียรภาพของ watchCreated (จาก useBTrust) ด้วย ref ---
  // const { watchCreated } = useBTrust()
  // type WatchCreated = (onLogs: (logs: any[]) => void) => () => void
  // const watchCreatedRef = useRef<WatchCreated | null>(null)
  // watchCreatedRef.current = watchCreated as unknown as WatchCreated

  // --- กัน fetchOnce ถูกเรียกซ้อน + อัปเดตเฉพาะเมื่อข้อมูลเปลี่ยนจริง ---
  const fetching = useRef(false)
  const lastDataSig = useRef<string | null>(null) // ใช้ signature เช็คความเปลี่ยนแปลง

  const fetchOnce = useCallback(async () => {
    if (fetching.current || !isMounted.current) return
    fetching.current = true
    try {
      // แสดงโหลดเฉพาะครั้งแรก/ตอน error -> กลับมาโอเค
      if (isLoading || error) setIsLoading(true)
      setError(null)

      const res = await fetch("/api/requests", { cache: "no-store" })
      if (!res.ok) throw new Error(`Fetch /api/requests failed: ${res.status}`)
      const json = (await res.json()) as RequestRow[]

      if (!isMounted.current) return

      // อัปเดตเฉพาะเมื่อผลลัพธ์เปลี่ยนจริง เพื่อตัดลูปเรนเดอร์ที่ไม่จำเป็น
      const sig = JSON.stringify(json)
      if (lastDataSig.current !== sig) {
        lastDataSig.current = sig
        setData(json)
      }
    } catch (e) {
      if (isMounted.current) setError(e)
    } finally {
      if (isMounted.current) setIsLoading(false)
      fetching.current = false
    }
  }, [isLoading, error])

  useEffect(() => {
    isMounted.current = true

    // initial load (ครั้งเดียว)
    fetchOnce()

    // polling เสถียร
    const t = window.setInterval(fetchOnce, pollMs)

    // subscribe on-chain event โดยอ้างอิงผ่าน ref (ไม่ผูกกับ deps)
    // let unwatch: (() => void) | undefined
    // if (watchCreatedRef.current) {
    //   unwatch = watchCreatedRef.current(() => {
    //     // debounce กันช็อต/ซ้อน
    //     window.setTimeout(fetchOnce, 300)
    //   })
    // }

    return () => {
      isMounted.current = false
      window.clearInterval(t)
      //   unwatch?.()
    }
    // สำคัญ: อย่าใส่ data/error/isLoading หรือ watchCreated ใน deps
  }, [pollMs, fetchOnce])

  return { data, isLoading, isError: !!error, error }
}
