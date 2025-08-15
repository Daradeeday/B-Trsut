// lib/hooks/useRequestsLive.ts
"use client";

import { useEffect, useRef } from "react";
import { usePublicClient } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

export type UseRequestsLiveOptions = {
  enabled?: boolean;
  pollingInterval?: number;
  onBlock?: () => void;
};

export function useRequestsLive(opts: UseRequestsLiveOptions = {}) {
  const publicClient = usePublicClient();            // ต้องอยู่ใต้ <WagmiConfig />
  const qc = useQueryClient();                       // ต้องอยู่ใต้ <QueryClientProvider />

  const enabled = opts.enabled ?? true;
  const pollingInterval = opts.pollingInterval ?? 5_000;

  // เก็บ callback ล่าสุด
  const cbRef = useRef<() => void>(() => {});
  cbRef.current =
    opts.onBlock ??
    (() => {
      qc.invalidateQueries({ queryKey: ["requests"] }).catch(() => {});
    });

  useEffect(() => {
    if (!publicClient || !enabled) return;

    const unwatch = publicClient.watchBlockNumber({
      emitOnBegin: false,
      poll: true,
      pollingInterval,
      onBlockNumber: () => cbRef.current(),
      onError: (err) => console.error("watchBlockNumber error:", err),
    });

    return () => {
      try { unwatch?.(); } catch {}
    };
  }, [publicClient, enabled, pollingInterval]);

  useEffect(() => {
    if (!enabled) return;
    const onFocus = () => cbRef.current();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [enabled]);
}
