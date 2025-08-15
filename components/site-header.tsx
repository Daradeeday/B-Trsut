import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl">B-Trust</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            หน้าหลัก
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            แดชบอร์ด
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button asChild>
            <Link href="/auth">เข้าสู่ระบบ</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
