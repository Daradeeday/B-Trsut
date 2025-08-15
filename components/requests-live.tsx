"use client"
import { useEffect } from "react"
import { useBTrustEvents } from "@/lib/hooks/useBTrustEvents"

export function RequestsLive() {
  const { watchCreated } = useBTrustEvents()

  useEffect(() => {
    const unwatch = watchCreated((logs) => {
      console.log("Created logs:", logs)
      // TODO: setState/refetch/notify ตามที่ต้องการ
    })
    return unwatch
  }, [watchCreated])

  return null
}