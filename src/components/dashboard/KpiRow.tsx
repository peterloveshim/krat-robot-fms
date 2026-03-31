import type { JSX } from "react";
import { AnimatedValue } from "@/components/ui/animated-value";
import {
  Bot,
  Zap,
  ClipboardList,
  Ruler,
  AlertTriangle,
} from "lucide-react";
import type { KpiData } from "@/lib/supabase/queries";

type KpiCardProps = {
  label: string;
  value: string | number;
  delta: string;
  deltaVariant: "up" | "down" | "neutral";
  icon: React.ReactNode;
  /** accent 색상 클래스 (아이콘 배경, 강조선 등) */
  accentBg: string;
  accentText: string;
  /** glow 클래스 */
  glowClass: string;
  /** 미니 스파크 바 데이터 (7개 값, 0~100) */
  sparkData: number[];
};

function SparkBar({ data, accentClass }: { data: number[]; accentClass: string }): JSX.Element {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[3px] h-6">
      {data.map((v, i) => (
        <div
          key={i}
          className={`w-[4px] rounded-sm transition-all duration-300 opacity-60 ${accentClass}`}
          style={{ height: `${Math.max((v / max) * 100, 8)}%` }}
        />
      ))}
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  deltaVariant,
  icon,
  accentBg,
  accentText,
  glowClass,
  sparkData,
}: KpiCardProps): JSX.Element {
  const deltaColor =
    deltaVariant === "up"
      ? "text-green-400"
      : deltaVariant === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className={`group relative glass-kpi rounded-xl p-4 transition-all duration-300 ${glowClass}`}>
      {/* 좌측 강조선 — 글로우 효과 */}
      <div className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-full ${accentBg} opacity-50 group-hover:opacity-100 transition-opacity`} />

      {/* 상단: 아이콘 + 스파크 바 */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentBg} bg-opacity-20`}>
          <span className={accentText}>{icon}</span>
        </div>
        <SparkBar data={sparkData} accentClass={accentBg} />
      </div>

      {/* 수치 */}
      <div className="text-[28px] font-extrabold tracking-[-0.04em] text-foreground leading-none mb-1">
        <AnimatedValue value={value} />
      </div>

      {/* 라벨 + 델타 */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.04em]">
          {label}
        </span>
        <span className={`text-[11px] font-semibold ${deltaColor}`}>
          {delta}
        </span>
      </div>
    </div>
  );
}

type KpiRowProps = { data: KpiData };

export function KpiRow({ data }: KpiRowProps): JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      <KpiCard
        label="총 로봇"
        value={data.totalRobots}
        delta="8개 단지"
        deltaVariant="neutral"
        icon={<Bot size={16} />}
        accentBg="bg-primary"
        accentText="text-primary"
        glowClass="glow-cyan"
        sparkData={[12, 13, 13, 14, 15, 15, 15]}
      />
      <KpiCard
        label="가동 중"
        value={data.operatingRobots}
        delta={`${Math.round((data.operatingRobots / Math.max(data.totalRobots, 1)) * 100)}%`}
        deltaVariant="up"
        icon={<Zap size={16} />}
        accentBg="bg-green-400"
        accentText="text-green-400"
        glowClass="glow-green"
        sparkData={[9, 11, 10, 12, 11, 13, 12]}
      />
      <KpiCard
        label="금일 미션"
        value={data.todayMissions}
        delta="진행+완료"
        deltaVariant="up"
        icon={<ClipboardList size={16} />}
        accentBg="bg-purple-500"
        accentText="text-purple-500"
        glowClass="glow-purple"
        sparkData={[18, 22, 20, 28, 30, 32, 34]}
      />
      <KpiCard
        label="금일 청소면적"
        value={`${data.todayAreaM2.toLocaleString()}`}
        delta="m\u00B2"
        deltaVariant="up"
        icon={<Ruler size={16} />}
        accentBg="bg-amber-400"
        accentText="text-amber-400"
        glowClass="glow-amber"
        sparkData={[2800, 3200, 3600, 3900, 4100, 4200, 4280]}
      />
      <KpiCard
        label="미해결 인시던트"
        value={data.openIncidents}
        delta={data.openIncidents > 0 ? "즉시 확인" : "이상 없음"}
        deltaVariant={data.openIncidents > 0 ? "down" : "neutral"}
        icon={<AlertTriangle size={16} />}
        accentBg={data.openIncidents > 0 ? "bg-destructive" : "bg-green-400"}
        accentText={data.openIncidents > 0 ? "text-destructive" : "text-green-400"}
        glowClass={data.openIncidents > 0 ? "glow-red" : "glow-green"}
        sparkData={[1, 2, 1, 3, 2, 3, data.openIncidents]}
      />
    </div>
  );
}
