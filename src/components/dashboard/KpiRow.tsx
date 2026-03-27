import { Card, CardContent } from "@/components/ui/card";
import { kpiData } from "@/lib/mock-data";

type KpiCardProps = {
  label: string;
  value: string | number;
  delta: string;
  deltaVariant?: "up" | "down" | "neutral";
};

function KpiCard({ label, value, delta, deltaVariant = "neutral" }: KpiCardProps) {
  const deltaColor =
    deltaVariant === "up"
      ? "text-[var(--krat-green)]"
      : deltaVariant === "down"
        ? "text-[var(--krat-red)]"
        : "text-[var(--krat-tx3)]";

  return (
    <Card className="bg-[var(--krat-bg2)] border-[var(--krat-border)] rounded-[var(--krat-radius)] shadow-none">
      <CardContent className="px-[18px] py-4">
        <div className="text-[12px] font-medium text-[var(--krat-tx3)] mb-1.5">{label}</div>
        <div className="text-[26px] font-bold tracking-[-0.03em] text-[var(--krat-tx)] leading-none">
          {value}
        </div>
        <div className={`text-[11px] font-medium mt-1 ${deltaColor}`}>{delta}</div>
      </CardContent>
    </Card>
  );
}

export function KpiRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <KpiCard
        label="총 로봇"
        value={kpiData.totalRobots}
        delta="8개 단지 배치"
        deltaVariant="neutral"
      />
      <KpiCard
        label="가동 중"
        value={kpiData.operatingRobots}
        delta={`+${kpiData.operatingRobots - 10}대 전일 대비`}
        deltaVariant="up"
      />
      <KpiCard
        label="금일 미션"
        value={kpiData.todayMissions}
        delta="+8건 전일 대비"
        deltaVariant="up"
      />
      <KpiCard
        label="금일 청소면적"
        value={`${kpiData.todayAreaM2.toLocaleString()} m²`}
        delta="+320 m² 전일 대비"
        deltaVariant="up"
      />
      <KpiCard
        label="미해결 인시던트"
        value={kpiData.openIncidents}
        delta="즉시 확인 필요"
        deltaVariant="down"
      />
    </div>
  );
}
