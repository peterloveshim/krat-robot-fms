import { Card, CardContent } from "@/components/ui/card";
import type { KpiData } from "@/lib/supabase/queries";

type KpiCardProps = {
  label: string;
  value: string | number;
  delta: string;
  deltaVariant?: "up" | "down" | "neutral";
};

function KpiCard({ label, value, delta, deltaVariant = "neutral" }: KpiCardProps) {
  const deltaColor =
    deltaVariant === "up"
      ? "text-krat-green"
      : deltaVariant === "down"
        ? "text-krat-red"
        : "text-krat-tx3";

  return (
    <Card className="bg-krat-bg2 border-krat-border rounded-krat shadow-none">
      <CardContent className="px-[18px] py-4">
        <div className="text-[12px] font-medium text-krat-tx3 mb-1.5">{label}</div>
        <div className="text-[26px] font-bold tracking-[-0.03em] text-krat-tx leading-none">
          {value}
        </div>
        <div className={`text-[11px] font-medium mt-1 ${deltaColor}`}>{delta}</div>
      </CardContent>
    </Card>
  );
}

type KpiRowProps = { data: KpiData };

export function KpiRow({ data }: KpiRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <KpiCard
        label="총 로봇"
        value={data.totalRobots}
        delta="8개 단지 배치"
        deltaVariant="neutral"
      />
      <KpiCard
        label="가동 중"
        value={data.operatingRobots}
        delta={`총 ${data.totalRobots}대 중`}
        deltaVariant="up"
      />
      <KpiCard
        label="금일 미션"
        value={data.todayMissions}
        delta="금일 시작된 미션"
        deltaVariant="up"
      />
      <KpiCard
        label="금일 청소면적"
        value={`${data.todayAreaM2.toLocaleString()} m²`}
        delta="완료 미션 기준"
        deltaVariant="up"
      />
      <KpiCard
        label="미해결 인시던트"
        value={data.openIncidents}
        delta={data.openIncidents > 0 ? "즉시 확인 필요" : "이상 없음"}
        deltaVariant={data.openIncidents > 0 ? "down" : "neutral"}
      />
    </div>
  );
}
