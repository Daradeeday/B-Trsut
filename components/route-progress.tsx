// components/route-progress.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function RouteProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)

  // เริ่ม progress เมื่อ pathname เปลี่ยน
  useEffect(() => {
    setActive(true)
    setProgress(10)
    const tick = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 10 : p))
    }, 200)

    // หน่วงเล็กน้อยก่อนจบเพื่อกันกระพริบ
    const done = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setActive(false)
        setProgress(0)
      }, 250)
    }, 700) // ปรับได้ตามชอบ

    return () => {
      clearInterval(tick)
      clearTimeout(done)
    }
  }, [pathname])

  const width = useMemo(() => `${progress}%`, [progress])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed left-0 right-0 top-0 z-[9998]"
        >
          <div className="h-0.5 w-full bg-transparent">
            <div className="h-0.5 bg-primary transition-[width] duration-150" style={{ width }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
