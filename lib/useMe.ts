"use client"
import { useQuery } from "@tanstack/react-query"
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const r = await fetch("/api/users/me", { credentials: "include", cache: "no-store" })
      if (!r.ok) throw new Error("not found")
      return r.json() as Promise<{ address:string; role:string; department?:string }>
    },
    retry: false
  })
}
