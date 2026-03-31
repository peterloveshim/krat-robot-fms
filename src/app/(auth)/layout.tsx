export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* KRAT 로고 */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-[16px] font-bold flex-shrink-0">
            K
          </div>
          <div>
            <div className="text-[17px] font-semibold tracking-tight text-foreground">
              KRAT FMS
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">
              로봇 관제 시스템
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
