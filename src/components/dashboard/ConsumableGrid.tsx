import type { JSX } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { AlertTriangle, Wrench } from "lucide-react";
import type { Consumable } from "@/lib/mock-data";

function getProgressColor(pct: number): string {
  if (pct <= 20) return "bg-krat-red";
  if (pct <= 30) return "bg-krat-amber";
  return "bg-krat-green";
}

function getUrgencyConfig(pct: number): { label: string; textClass: string; bgClass: string } {
  if (pct <= 15) {
    return { label: "즉시 교체", textClass: "text-krat-red", bgClass: "bg-krat-red-bg" };
  }
  if (pct <= 25) {
    return { label: "교체 임박", textClass: "text-krat-amber", bgClass: "bg-krat-amber-bg" };
  }
  return { label: "교체 예정", textClass: "text-krat-tx3", bgClass: "bg-white/[0.04]" };
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
              className={`group relative glass-card rounded-xl overflow-hidden transition-all duration-300 ${
                isCritical ? "glow-red" : ""
              }`}
            >
              {/* 상단 긴급도 바 — critical일 때만 표시 */}
              {isCritical && (
                <div
                  className="h-[2px]"
                  style={{ background: "linear-gradient(90deg, #FF3B5C, rgba(255, 0, 110, 0.6), transparent)" }}
                />
              )}

              <div className="p-4">
                {/* 헤더: 아이콘 + 이름 + 긴급도 라벨 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCritical ? "bg-krat-red-bg" : "bg-white/[0.04]"
                    }`}>
                      {isCritical ? (
                        <AlertTriangle size={14} className="text-krat-red" />
                      ) : (
                        <Wrench size={14} className="text-krat-tx3" />
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-krat-tx">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-krat-tx3">
                        {item.robotName}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${urgency.textClass} ${urgency.bgClass}`}>
                    {urgency.label}
                  </span>
                </div>

                {/* 프로그레스 바 */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-krat-tx3 uppercase tracking-wider font-medium">
                      잔량
                    </span>
                    <span className={`text-[16px] font-extrabold font-mono tabular-nums ${
                      item.remainingPct <= 20
                        ? "text-krat-red"
                        : item.remainingPct <= 30
                          ? "text-krat-amber"
                          : "text-krat-green"
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
                <div className="text-[11px] text-krat-tx3 pt-2 border-t border-white/[0.06]">
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
