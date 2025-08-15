"use client"
import { useCallback } from "react"
import { usePublicClient } from "wagmi"
import { watchCreatedWithClient } from "../btrust-core"

export function useBTrustEvents() {
  const client = usePublicClient()

  const watchCreated = useCallback(
    (onLogs: (logs: any[]) => void) => {
      if (!client) return () => {}
      return watchCreatedWithClient(client, onLogs)
    },
    [client]
  )

  return { watchCreated }
}