"use client"
import { useEffect, useRef, useState } from "react"

export function useLoadingGate(
  active: boolean,
  { delayMs = 400, minDurationMs = 1200 }: { delayMs?: number; minDurationMs?: number } = {}
) {
  const [show, setShow] = useState(false)
  const shownAtRef = useRef<number | null>(null)
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // เคลียร์ทุกครั้งกันซ้อน
    if (delayTimer.current) { clearTimeout(delayTimer.current); delayTimer.current = null }
    if (hideTimer.current)  { clearTimeout(hideTimer.current);  hideTimer.current  = null }

    if (active) {
      // ดีเลย์ก่อนจะโชว์
      delayTimer.current = setTimeout(() => {
        setShow(true)
        shownAtRef.current = Date.now()
      }, Math.max(0, delayMs))
    } else {
      // ถ้าแสดงอยู่ บังคับให้อยู่ให้ครบ minDuration ก่อนค่อยซ่อน
      if (show) {
        const elapsed = Date.now() - (shownAtRef.current ?? Date.now())
        const remain = Math.max(0, minDurationMs - elapsed)
        hideTimer.current = setTimeout(() => setShow(false), remain)
      } else {
        setShow(false)
      }
    }

    return () => {
      if (delayTimer.current) clearTimeout(delayTimer.current)
      if (hideTimer.current)  clearTimeout(hideTimer.current)
    }
  }, [active, delayMs, minDurationMs, show])

  return show
}
