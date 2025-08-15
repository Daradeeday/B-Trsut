"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, Wallet } from "lucide-react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { useSession } from "@/lib/useSession"
import { useAccount } from "wagmi"

const ConnectButton = dynamic( () => import("@rainbow-me/rainbowkit").then(m => m.ConnectButton), { ssr: false } )

const roles = [
  { value: "REQUESTER",  label: "ผู้ขอ",       color: "bg-blue-100 text-blue-800" },
  { value: "ACCOUNTING", label: "บัญชี",       color: "bg-amber-100 text-amber-800" },
  { value: "MANAGEMENT", label: "ผู้บริหาร",   color: "bg-green-100 text-green-800" },
  { value: "ADMIN",      label: "ผู้ดูแลระบบ",  color: "bg-purple-100 text-purple-800" },
]

// ดึงชื่อจาก session ที่ล็อกอิน
function pickLoginName(user: any): string | undefined {
  return user?.displayName ?? user?.name ?? user?.username ?? (user?.email ? String(user.email).split("@")[0] : undefined)
}

export function Topbar() {
  const { data } = useSession()
  const { address, isConnected } = useAccount()

  const [currentRole, setCurrentRole] = useState("REQUESTER")

  // ชื่อที่แสดงบน Topbar (UI เดิม + เพิ่มชื่อเล็ก ๆ)
  const [displayName, setDisplayName] = useState("ผู้ใช้")
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("ผู้ใช้")

  // ค่าเริ่มต้น: localStorage → session → default
  useEffect(() => {
    const local = typeof window !== "undefined" ? localStorage.getItem("displayName") : null
    const fromLogin = pickLoginName(data?.user)
    const initial = (local && local.trim()) || (fromLogin && String(fromLogin)) || "ผู้ใช้"
    setDisplayName(initial)
    setDraft(initial)
  }, [data?.user])

  const currentRoleData = roles.find((r) => r.value === currentRole)

  const startEdit = () => setEditing(true)
  const finishEdit = () => {
    const clean = (draft || "").trim() || "ผู้ใช้"
    setDisplayName(clean)
    if (typeof window !== "undefined") localStorage.setItem("displayName", clean)
    setEditing(false)
  }

  const shortAddr = (addr?: string) => (addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : "ยังไม่เชื่อมต่อ")

  return (
    <header className="flex h-16 items-center justify-between px-6 bg-white dark:bg-gray-900 border-b">
      {/* ซ้าย: ชื่อหน้า + ชื่อผู้ใช้ (เพิ่มเล็กน้อย แต่หน้าตาเดิม) */}
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-semibold">Dashboard</h1>

        {/* ชื่อผู้ใช้แบบอินไลน์: คลิกเพื่อแก้ */}
        {!editing ? (
          <div
            className="text-sm text-muted-foreground cursor-text select-none"
            title="คลิกเพื่อแก้ชื่อแสดงผล"
            onClick={startEdit}
          >
            ชื่อ: <span className="font-medium text-foreground">{displayName}</span>
          </div>
        ) : (
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => { if (e.key === "Enter") finishEdit() }}
            className="h-8 w-44"
          />
        )}
      </div>

      {/* ขวา: ตัวเลือกบทบาท / ป้ายบทบาท / กล่องกระเป๋าแบบเดิม / แจ้งเตือน / โหมด / ConnectButton เดิม */}
      <div className="flex items-center space-x-4">
        {/* Role Switcher */}
        

        {/* Current Role Badge (เดิม) */}
        {currentRoleData && <Badge className={currentRoleData.color}>{currentRoleData.label}</Badge>}

        {/* กล่องกระเป๋าเดิม แต่ใส่ที่อยู่จริงถ้าเชื่อมต่อแล้ว */}
        

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <ModeToggle />

        {/* ConnectButton ของ RainbowKit (หน้าตาเดิม ไม่แต่ง) */}
        <ConnectButton />
      </div>
    </header>
  )
}
export default Topbar