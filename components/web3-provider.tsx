"use client";

import type { ReactNode } from "react";
import { WagmiConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ---------- SINGLETON HELPERS ----------
function getSingleton<T>(key: string, create: () => T): T {
  const g = globalThis as unknown as Record<string, any>;
  if (!g.__btrust) g.__btrust = {};
  if (!g.__btrust[key]) g.__btrust[key] = create();
  return g.__btrust[key] as T;
}

// QueryClient เป็น singleton
const queryClient = getSingleton("queryClient", () => new QueryClient());

// Wagmi/RainbowKit config เป็น singleton
const wagmiConfig = getSingleton("wagmiConfig", () =>
  getDefaultConfig({
    appName: "B-Trust",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,      // ต้องมีใน .env.local
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_SEPOLIA!), // ต้องมีใน .env.local
    },
    ssr: true,
  })
);

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
