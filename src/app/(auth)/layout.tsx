export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-krat-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* KRAT 로고 */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-krat-accent flex items-center justify-center text-white text-[16px] font-bold flex-shrink-0">
            K
          </div>
          <div>
            <div className="text-[17px] font-semibold tracking-tight text-krat-tx">
              KRAT FMS
            </div>
            <div className="text-[11px] text-krat-tx3 font-mono">
              로봇 관제 시스템
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
