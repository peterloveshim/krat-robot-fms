"use client";

import type { JSX } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/ui/status-badge";
import { AnimatedValue } from "@/components/ui/animated-value";
import { MapPin, Wifi, Battery } from "lucide-react";
import type { Robot } from "@/lib/mock-data";

type RobotCardProps = {
  robot: Robot;
};

/** 로봇 타입별 아이콘 — glass 내부 인디케이터 */
function RobotTypeIndicator({ subtype, status }: { subtype: Robot["subtype"]; status: Robot["status"] }): JSX.Element {
  const isWet = subtype === "WET_SCRUB";
  const isNamux = subtype === "NAMUX";

  let bgClass: string;
  let textClass: string;
  let label: string;
  let borderClass: string;

  if (isWet) {
    bgClass = "bg-white/[0.08]";
    textClass = "text-foreground";
    borderClass = "border-border";
    label = "W";
  } else if (isNamux) {
    bgClass = "bg-white/[0.08]";
    textClass = "text-foreground";
    borderClass = "border-border";
    label = "A";
  } else {
    bgClass = "bg-white/[0.08]";
    textClass = "text-foreground";
    borderClass = "border-border";
    label = "D";
  }

  const isActive = status === "WORKING" || status === "ONLINE" || status === "RETURNING";

  return (
    <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 border ${bgClass} ${textClass} ${borderClass}`}>
      {label}
      {isActive && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border-2 border-background" />
      )}
    </div>
  );
}

/** 세그먼트형 배터리 바 — glass 내부 게이지 */
function BatteryGauge({ pct }: { pct: number }): JSX.Element {
  const segments = 10;
  const filled = Math.round((pct / 100) * segments);

  const getSegmentColor = (index: number): string => {
    if (index >= filled) return "bg-white/[0.04]";
    if (pct >= 50) return "bg-green-400";
    if (pct >= 20) return "bg-amber-400";
    return "bg-destructive";
  };

  const textColor =
    pct >= 50 ? "text-green-400" : pct >= 20 ? "text-amber-400" : "text-destructive";

  return (
    <div className="flex items-center gap-2">
      <Battery size={12} className={textColor} />
      <div className="flex gap-[2px] flex-1">
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={`h-[6px] flex-1 rounded-[1px]  ${getSegmentColor(i)}`}
          />
        ))}
      </div>
      <span className={`text-[11px] font-mono font-bold tabular-nums ${textColor}`}>
        {pct}%
      </span>
    </div>
  );
}

/** 데이터 포인트 — 컴팩트한 stat 표시 */
function DataPoint({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: string;
}): JSX.Element {
  return (
    <div className="flex flex-col">
      <span className={`text-[13px] font-semibold font-mono leading-none tabular-nums ${color ?? "text-foreground"}`}>
        <AnimatedValue value={value} />
      </span>
      <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function RobotCard({ robot }: RobotCardProps): JSX.Element {
  const isCleaning = robot.category === "CLEANING";
  const isWet = robot.subtype === "WET_SCRUB";
  const isError = robot.status === "ERROR";

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`group relative bg-card border rounded-xl cursor-pointer text-left w-full overflow-hidden ${isError ? "border-destructive/30" : "border-border"}`}
        >
          {/* 에러 상태 — 상단 경고 바 */}
          {isError && (
            <div className="h-[2px] bg-destructive" />
          )}

          <div className="p-4">
            {/* 헤더: 아이콘 + 이름 + 상태 */}
            <div className="flex items-start gap-3 mb-3">
              <RobotTypeIndicator subtype={robot.subtype} status={robot.status} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold truncate text-foreground">
                  {robot.displayName}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono tracking-wider">
                  {robot.serialNumber}
                </div>
              </div>
              <StatusBadge status={robot.status} />
            </div>

            {/* 배터리 게이지 */}
            <div className="mb-3">
              <BatteryGauge pct={robot.batteryPct} />
            </div>

            {/* 데이터 포인트 내부 패널 */}
            <div className="flex items-start gap-4 py-2 px-2 bg-[#0e0e0e] rounded-lg mb-3 border border-border">
              {isCleaning && isWet ? (
                <>
                  <DataPoint
                    value={`${robot.cleanWaterPct ?? 0}%`}
                    label="청수"
                    color="text-primary"
                  />
                  <div className="w-px h-6 bg-white/8 self-center" />
                  <DataPoint
                    value={`${robot.dirtyWaterPct ?? 0}%`}
                    label="오수"
                    color={
                      (robot.dirtyWaterPct ?? 0) >= 80
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  />
                  {robot.coveragePct !== undefined && (
                    <>
                      <div className="w-px h-6 bg-white/8 self-center" />
                      <DataPoint
                        value={`${robot.coveragePct}%`}
                        label="커버리지"
                        color={
                          robot.coveragePct >= 90
                            ? "text-green-400"
                            : robot.coveragePct >= 50
                              ? "text-amber-400"
                              : "text-destructive"
                        }
                      />
                    </>
                  )}
                </>
              ) : robot.coveragePct !== undefined ? (
                <>
                  <DataPoint
                    value={`${robot.coveragePct}%`}
                    label="커버리지"
                    color={
                      robot.coveragePct >= 90
                        ? "text-green-400"
                        : robot.coveragePct >= 50
                          ? "text-amber-400"
                          : "text-destructive"
                    }
                  />
                  <div className="w-px h-6 bg-white/8 self-center" />
                  <DataPoint value={robot.firmwareVersion} label="펌웨어" />
                </>
              ) : (
                <>
                  <DataPoint value={robot.firmwareVersion} label="펌웨어" />
                  <div className="w-px h-6 bg-white/8 self-center" />
                  <DataPoint value="-" label="미션 없음" />
                </>
              )}
            </div>

            {/* 위치 — 하단 */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">
                {robot.complexName} · {robot.zoneName}
              </span>
              <Wifi size={10} className="ml-auto shrink-0 text-green-400 opacity-50" />
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-[#1a1a1a] border border-border text-muted-foreground text-xs"
      >
        <p>{robot.manufacturer} · {robot.model}</p>
        <p className="font-mono text-muted-foreground/70">{robot.firmwareVersion}</p>
      </TooltipContent>
    </Tooltip>
  );
}
