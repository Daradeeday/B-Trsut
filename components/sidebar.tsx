"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Vote, CheckSquare, Receipt, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/useSession"
import { useRouter } from "next/navigation"      // ✅ ใช้สำหรับเปลี่ยนเส้นทางหลังออกจากระบบ
import { useDisconnect } from "wagmi" 

// รายการเมนูนำทางใน Sidebar
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create Request", href: "/withdraw", icon: FileText },
  { name: "Vote", href: "/vote", icon: Vote },
  { name: "Final Approval", href: "/approve-voting", icon: CheckSquare },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Roles", href: "/roles", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  
  // ฟังก์ชันออกจากระบบ
  async function handleLogout() {
    try {
      await logout()        // ลบคุกกี้ session ฝั่งเซิร์ฟเวอร์
      disconnect()          // ตัดการเชื่อมต่อกระเป๋า (RainbowKit/Wagmi)
      router.replace("/auth") // ส่งผู้ใช้ไปหน้าลงชื่อเข้าใช้ใหม่
      router.refresh()      // รีเฟรชหน้าจอเพื่อให้ state เป็นค่าใหม่
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-900 border-r">
      {/* โลโก้และชื่อระบบ */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <span className="font-bold text-xl">B-Trust</span>
        </Link>
      </div>

      {/* เมนูนำทาง */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* ปุ่มออกจากระบบ */}
      <div className="p-4 border-t">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  )
}
