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
    bgClass = "bg-krat-accent/10";
    textClass = "text-krat-accent";
    borderClass = "border-krat-accent/20";
    label = "W";
  } else if (isNamux) {
    bgClass = "bg-krat-green/10";
    textClass = "text-krat-green";
    borderClass = "border-krat-green/20";
    label = "A";
  } else {
    bgClass = "bg-krat-amber/10";
    textClass = "text-krat-amber";
    borderClass = "border-krat-amber/20";
    label = "D";
  }

  const isActive = status === "WORKING" || status === "ONLINE" || status === "RETURNING";

  return (
    <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 border ${bgClass} ${textClass} ${borderClass}`}>
      {label}
      {/* 활성 상태 펄스 */}
      {isActive && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-krat-green border-2 border-krat-bg">
          <span className="absolute inset-0 rounded-full bg-krat-green animate-ping opacity-40" />
        </span>
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
    if (pct >= 50) return "bg-krat-green";
    if (pct >= 20) return "bg-krat-amber";
    return "bg-krat-red";
  };

  const textColor =
    pct >= 50 ? "text-krat-green" : pct >= 20 ? "text-krat-amber" : "text-krat-red";

  return (
    <div className="flex items-center gap-2">
      <Battery size={12} className={textColor} />
      <div className="flex gap-[2px] flex-1">
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={`h-[6px] flex-1 rounded-[1px] transition-colors duration-300 ${getSegmentColor(i)}`}
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
      <span className={`text-[13px] font-semibold font-mono leading-none tabular-nums ${color ?? "text-krat-tx"}`}>
        <AnimatedValue value={value} />
      </span>
      <span className="text-[9px] text-krat-tx3 mt-0.5 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function getGlowClass(status: Robot["status"]): string {
  switch (status) {
    case "ERROR":
      return "glow-red";
    case "WORKING":
      return "glow-purple";
    case "CHARGING":
      return "glow-cyan";
    case "ONLINE":
    case "RETURNING":
      return "glow-green";
    default:
      return "";
  }
}

export function RobotCard({ robot }: RobotCardProps): JSX.Element {
  const isCleaning = robot.category === "CLEANING";
  const isWet = robot.subtype === "WET_SCRUB";
  const isError = robot.status === "ERROR";
  const glowClass = getGlowClass(robot.status);

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`group relative glass-card rounded-xl cursor-pointer transition-all duration-300 text-left w-full overflow-hidden ${glowClass}`}
        >
          {/* 에러 상태 — 상단 경고 바 (마젠타-레드 그라디언트) */}
          {isError && (
            <div
              className="h-[2px]"
              style={{ background: "linear-gradient(90deg, #FF3B5C, rgba(255, 0, 110, 0.6), transparent)" }}
            />
          )}

          <div className="p-4">
            {/* 헤더: 아이콘 + 이름 + 상태 */}
            <div className="flex items-start gap-3 mb-3">
              <RobotTypeIndicator subtype={robot.subtype} status={robot.status} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold truncate text-krat-tx group-hover:text-white transition-colors">
                  {robot.displayName}
                </div>
                <div className="text-[10px] text-krat-tx3 font-mono tracking-wider">
                  {robot.serialNumber}
                </div>
              </div>
              <StatusBadge status={robot.status} />
            </div>

            {/* 배터리 게이지 */}
            <div className="mb-3">
              <BatteryGauge pct={robot.batteryPct} />
            </div>

            {/* 데이터 포인트 — glass 내부 패널 */}
            <div className="flex items-start gap-4 py-2 px-2 bg-white/2 rounded-lg mb-3 border border-white/4">
              {isCleaning && isWet ? (
                <>
                  <DataPoint
                    value={`${robot.cleanWaterPct ?? 0}%`}
                    label="청수"
                    color="text-krat-accent"
                  />
                  <div className="w-px h-6 bg-white/8 self-center" />
                  <DataPoint
                    value={`${robot.dirtyWaterPct ?? 0}%`}
                    label="오수"
                    color={
                      (robot.dirtyWaterPct ?? 0) >= 80
                        ? "text-krat-red"
                        : "text-krat-tx2"
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
                            ? "text-krat-green"
                            : robot.coveragePct >= 50
                              ? "text-krat-amber"
                              : "text-krat-red"
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
                        ? "text-krat-green"
                        : robot.coveragePct >= 50
                          ? "text-krat-amber"
                          : "text-krat-red"
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
            <div className="flex items-center gap-1.5 text-[11px] text-krat-tx3">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">
                {robot.complexName} · {robot.zoneName}
              </span>
              <Wifi size={10} className="ml-auto shrink-0 text-krat-green opacity-50" />
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="glass-panel rounded-lg text-krat-tx2 text-xs"
      >
        <p>{robot.manufacturer} · {robot.model}</p>
        <p className="font-mono text-krat-tx3">{robot.firmwareVersion}</p>
      </TooltipContent>
    </Tooltip>
  );
}
