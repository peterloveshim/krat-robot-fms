export function PageHeader() {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-[var(--krat-tx)]">
          대시보드
        </h1>
        <p className="text-[13px] text-[var(--krat-tx2)] mt-0.5">
          크라트로보틱스 FMS — 8개 단지 15대 로봇
        </p>
      </div>
      <div className="flex items-center gap-2 font-mono text-[12px] text-[var(--krat-tx3)] bg-[var(--krat-bg3)] px-3 py-1.5 rounded-lg flex-shrink-0">
        <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-[var(--krat-green)]" />
        LIVE · 2026-03-27 14:32 KST
      </div>
    </div>
  );
}
