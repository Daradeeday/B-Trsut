export function explorerTx(hash: string) {
  const isAmoy = (process.env.NEXT_PUBLIC_DEFAULT_CHAIN || "sepolia").toLowerCase() === "amoy"
  const base = isAmoy ? "https://amoy.polygonscan.com/tx/" : "https://sepolia.etherscan.io/tx/"
  return base + hash
}
