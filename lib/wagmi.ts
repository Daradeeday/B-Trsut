import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http, createConfig } from 'wagmi'
import { mainnet, base, sepolia } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'
import { singleton } from './singleton'

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
if (!projectId) {
  // จะช่วยหา root cause ได้ชัดใน dev
  // eslint-disable-next-line no-console
  console.error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
}

export const wagmiConfig = singleton('wagmi-config', () =>
  getDefaultConfig({
    appName: 'B-Trust',
    projectId,                       // <-- ต้องเป็น Project ID จริงจาก Reown/WalletConnect
    chains: [mainnet, base, sepolia],
    transports: {
      [mainnet.id]: http(),
      [base.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true,
  })
)

// สร้างครั้งเดียวเช่นกัน
export const queryClient = singleton('react-query-client', () => new QueryClient())
