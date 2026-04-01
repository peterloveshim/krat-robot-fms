import type { JSX } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { RobotCard } from "./RobotCard";
import type { Robot } from "@/lib/mock-data";

type RobotGridProps = { robots: Robot[]; isLoading?: boolean };

// 스켈레톤 색상 — 카드(#111) 위에 올라오는 요소들
// dim: #1e1e1e (border 색), dimmer: #181818 (더 미묘한 요소)
const S = "bg-[#1e1e1e]";      // 주요 블록
const S2 = "bg-[#181818]";     // 보조 블록 (레이블 등)

function SkeletonDataPoint(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* value: text-[13px] font-mono leading-none */}
      <div className={`h-[13px] w-10 rounded-sm ${S}`} />
      {/* label: text-[9px] uppercase mt-0.5 */}
      <div className={`h-[9px] w-7 rounded-sm ${S2} mt-[3px]`} />
    </div>
  );
}

function RobotCardSkeleton(): JSX.Element {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="p-4">

        {/* ── 헤더: RobotTypeIndicator + 이름/시리얼 + StatusBadge ── */}
        <div className="flex items-start gap-3 mb-3">
          {/* RobotTypeIndicator: w-10 h-10 rounded-lg border */}
          <div className={`w-10 h-10 rounded-lg border border-border ${S2} shrink-0`} />

          {/* 이름(14px bold) + 시리얼(10px mono) */}
          <div className="flex-1 min-w-0 flex flex-col gap-[6px] pt-[2px]">
            <div className={`h-[14px] w-[96px] rounded-sm ${S}`} />
            <div className={`h-[10px] w-[72px] rounded-sm ${S2}`} />
          </div>

          {/* StatusBadge: text-[11px] px-2.5 py-0.5 rounded-full */}
          <div className={`h-[22px] w-[52px] rounded-full border border-border ${S2}`} />
        </div>

        {/* ── BatteryGauge: Battery icon + 10 segments + % text ── */}
        <div className="flex items-center gap-2 mb-3">
          {/* Battery icon size=12 */}
          <div className={`w-3 h-3 rounded-sm ${S2}`} />
          {/* 10 세그먼트 — 실제 카드와 동일한 h-[6px] flex gap-[2px] */}
          <div className="flex gap-[2px] flex-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className={`h-[6px] flex-1 rounded-[1px] ${S}`} />
            ))}
          </div>
          {/* "XX%" text-[11px] font-mono → w-[28px] h-[11px] */}
          <div className={`h-[11px] w-7 rounded-sm ${S2}`} />
        </div>

        {/* ── 데이터 패널: bg-[#0e0e0e] border border-border rounded-lg ── */}
        <div className="flex items-start gap-4 py-2 px-2 bg-[#0e0e0e] rounded-lg mb-3 border border-border">
          <SkeletonDataPoint />
          {/* 구분선: w-px h-6 */}
          <div className="w-px h-6 bg-white/[0.05] self-center" />
          <SkeletonDataPoint />
          {/* 세번째 DataPoint (WET_SCRUB 카드에 존재) */}
          <div className="w-px h-6 bg-white/[0.05] self-center" />
          <SkeletonDataPoint />
        </div>

        {/* ── 위치: MapPin + 텍스트 + Wifi ── */}
        <div className="flex items-center gap-1.5">
          {/* MapPin size=11 */}
          <div className={`w-[11px] h-[11px] rounded-sm ${S2} shrink-0`} />
          {/* "단지명 · 구역명" text-[11px] */}
          <div className={`h-[11px] w-[120px] rounded-sm ${S2}`} />
          {/* Wifi size=10 ml-auto */}
          <div className={`w-[10px] h-[10px] rounded-sm ${S2} ml-auto shrink-0`} />
        </div>

      </div>
    </div>
  );
}

export function RobotGrid({ robots, isLoading = false }: RobotGridProps): JSX.Element {
  return (
    <section className="mb-8">
      <SectionHeader title="로봇 현황" action="전체 보기" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 12 }, (_, i) => <RobotCardSkeleton key={i} />)
          : robots.map((robot) => <RobotCard key={robot.id} robot={robot} />)}
      </div>
    </section>
  );
}
