export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="font-semibold">B-Trust</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">ผู้ทำคือ B-Trust • ลิขสิทธิ์ของ B-Trust</p>
          <p className="text-xs text-muted-foreground text-center max-w-md">
            ระบบการเงินโปร่งใสด้วยเทคโนโลยีบล็อกเชนสำหรับสถานศึกษา
          </p>
        </div>
      </div>
    </footer>
  )
}
