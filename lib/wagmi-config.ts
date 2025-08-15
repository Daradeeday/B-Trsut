// lib/wagmi-config.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'B-Trust',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!, // ใส่ใน .env.local
  chains: [mainnet, sepolia],
  ssr: true, // ให้ wagmi ทำงานร่วมกับ Next ได้ดี
});
