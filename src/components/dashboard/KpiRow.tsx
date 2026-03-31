import type { JSX } from "react";
import type { KpiData } from "@/lib/supabase/queries";

type StatItemProps = {
  label: string;
  value: string | number;
  subtext?: string;
  isAlert?: boolean;
};

function StatItem({ label, value, subtext, isAlert }: StatItemProps): JSX.Element {
  return (
    <div className="px-6 py-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2">
        {label}
      </div>
      <div suppressHydrationWarning className={`text-[32px] font-bold leading-none tabular-nums ${isAlert ? "text-destructive" : "text-foreground"}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-[11px] text-muted-foreground mt-1">{subtext}</div>
      )}
    </div>
  );
}

type KpiRowProps = { data: KpiData };

export function KpiRow({ data }: KpiRowProps): JSX.Element {
  const operatingPct = Math.round((data.operatingRobots / Math.max(data.totalRobots, 1)) * 100);

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-border divide-y sm:divide-y-0">
        <StatItem label="총 로봇" value={data.totalRobots} subtext="8개 단지" />
        <StatItem label="가동 중" value={data.operatingRobots} subtext={`${operatingPct}%`} />
        <StatItem label="금일 미션" value={data.todayMissions} subtext="진행+완료" />
        <StatItem label="청소 면적" value={data.todayAreaM2.toLocaleString()} subtext="m²" />
        <StatItem
          label="미해결 인시던트"
          value={data.openIncidents}
          subtext={data.openIncidents > 0 ? "즉시 확인" : "이상 없음"}
          isAlert={data.openIncidents > 0}
        />
      </div>
    </div>
  );
}
