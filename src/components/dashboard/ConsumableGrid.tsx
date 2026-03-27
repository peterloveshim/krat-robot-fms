import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { consumables } from "@/lib/mock-data";

function getProgressColor(pct: number): string {
  if (pct <= 20) return "bg-krat-red";
  if (pct <= 30) return "bg-krat-amber";
  return "bg-krat-green";
}

function getPctColor(pct: number): string {
  if (pct <= 20) return "text-krat-red";
  if (pct <= 30) return "text-krat-amber";
  return "text-krat-green";
}

export function ConsumableGrid() {
  return (
    <section className="mb-7">
      <SectionHeader title="소모품 현황" action="전체 보기 →" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {consumables.map((item) => (
          <Card
            key={item.id}
            className="bg-krat-bg2 border-krat-border rounded-krat shadow-none"
          >
            <CardContent className="px-4 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium">{item.name}</span>
                <span className={`text-[13px] font-semibold font-mono ${getPctColor(item.remainingPct)}`}>
                  {item.remainingPct}%
                </span>
              </div>
              {/* shadcn Progress + 커스텀 색상 오버라이드 */}
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-krat-bg4">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor(item.remainingPct)}`}
                  style={{ width: `${item.remainingPct}%` }}
                />
              </div>
              <div className="text-[11px] text-krat-tx3 mt-1.5">
                {item.robotName} · {item.alertMessage}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
