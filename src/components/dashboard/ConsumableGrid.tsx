import type { JSX } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { AlertTriangle, Wrench } from "lucide-react";
import type { Consumable } from "@/lib/mock-data";

function getProgressColor(pct: number): string {
  if (pct <= 20) return "bg-destructive";
  if (pct <= 30) return "bg-amber-400";
  return "bg-green-400";
}

function getUrgencyConfig(pct: number): { label: string; textClass: string; bgClass: string; borderClass: string } {
  if (pct <= 15) {
    return { label: "즉시 교체", textClass: "text-destructive", bgClass: "", borderClass: "border-destructive/40" };
  }
  if (pct <= 25) {
    return { label: "교체 임박", textClass: "text-[#e5a020]", bgClass: "", borderClass: "border-[#4a3800]" };
  }
  return { label: "교체 예정", textClass: "text-muted-foreground", bgClass: "", borderClass: "border-border" };
}

type ConsumableGridProps = { consumables: Consumable[] };

export function ConsumableGrid({ consumables }: ConsumableGridProps): JSX.Element {
  return (
    <section>
      <SectionHeader title="소모품 현황" action="전체 보기 →" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {consumables.map((item) => {
          const urgency = getUrgencyConfig(item.remainingPct);
          const isCritical = item.remainingPct <= 15;

          return (
            <div
              key={item.id}
              className={`group bg-card border rounded-xl overflow-hidden transition-colors duration-200 ${
                isCritical ? "border-destructive/30" : "border-border"
              }`}
            >
              {/* 상단 긴급도 바 — critical일 때만 표시 */}
              {isCritical && (
                <div className="h-[2px] bg-destructive" />
              )}

              <div className="p-4">
                {/* 헤더: 아이콘 + 이름 + 긴급도 라벨 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#1a1a1a] border border-border">
                      {isCritical ? (
                        <AlertTriangle size={14} className="text-destructive" />
                      ) : (
                        <Wrench size={14} className="text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-foreground">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.robotName}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${urgency.borderClass} ${urgency.textClass}`}>
                    {urgency.label}
                  </span>
                </div>

                {/* 프로그레스 바 */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      잔량
                    </span>
                    <span className={`text-[16px] font-extrabold font-mono tabular-nums ${
                      item.remainingPct <= 20
                        ? "text-destructive"
                        : item.remainingPct <= 30
                          ? "text-amber-400"
                          : "text-green-400"
                    }`}>
                      {item.remainingPct}%
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(item.remainingPct)}`}
                      style={{ width: `${item.remainingPct}%` }}
                    />
                  </div>
                </div>

                {/* 알림 메시지 */}
                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border">
                  {item.alertMessage}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
