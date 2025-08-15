"use client"

import useSWR from "swr"

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", cache: "no-store" }).then(async r => {
    if (!r.ok) throw new Error((await r.text()) || "unauthorized")
    return r.json()
  })

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR("/api/auth/session", fetcher, {
    revalidateOnFocus: true,
  })
  return {
    data,
    isError: !!error,
    isLoading,
    refresh: () => mutate(),
  }
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
}
