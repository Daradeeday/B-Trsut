// components/page-loader.tsx
"use client"

import { motion } from "framer-motion"

export default function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-background/70 backdrop-blur">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-col items-center gap-4 rounded-2xl p-8 shadow-xl bg-card"
      >
        <div className="relative h-14 w-14">
          <motion.span
            className="absolute inset-0 rounded-full border-4 border-muted-foreground/40"
            aria-hidden
          />
          <motion.span
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            aria-hidden
          />
        </div>

        <div className="text-center">
          <p className="text-base font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">โปรดรอสักครู่…</p>
        </div>
      </motion.div>
    </div>
  )
}
