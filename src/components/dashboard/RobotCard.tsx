import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/ui/status-badge";
import { MapPin } from "lucide-react";
import type { Robot } from "@/lib/mock-data";

type RobotCardProps = {
  robot: Robot;
};

function RobotIcon({ subtype }: { subtype: Robot["subtype"] }) {
  const isWet = subtype === "WET_SCRUB";
  const isNamux = subtype === "NAMUX";

  let bgClass: string;
  let textClass: string;
  let label: string;

  if (isWet) {
    bgClass = "bg-[rgba(59,130,246,0.12)]";
    textClass = "text-[var(--krat-accent)]";
    label = "W";
  } else if (isNamux) {
    bgClass = "bg-[var(--krat-green-bg)]";
    textClass = "text-[var(--krat-green)]";
    label = "A";
  } else {
    bgClass = "bg-[var(--krat-amber-bg)]";
    textClass = "text-[var(--krat-amber)]";
    label = "D";
  }

  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0 ${bgClass} ${textClass}`}
    >
      {label}
    </div>
  );
}

function StatBox({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="bg-[var(--krat-bg3)] rounded-md px-2.5 py-2 text-center">
      <div
        className={`text-[15px] font-semibold leading-none ${color ?? "text-[var(--krat-tx)]"}`}
      >
        {value}
      </div>
      <div className="text-[10px] text-[var(--krat-tx3)] mt-1">{label}</div>
    </div>
  );
}

function getBatteryColor(pct: number): string {
  if (pct >= 50) return "text-[var(--krat-green)]";
  if (pct >= 20) return "text-[var(--krat-amber)]";
  return "text-[var(--krat-red)]";
}

export function RobotCard({ robot }: RobotCardProps) {
  const isCleaning = robot.category === "CLEANING";
  const isWet = robot.subtype === "WET_SCRUB";

  return (
    <Tooltip>
      <TooltipTrigger>
        <Card className="bg-[var(--krat-bg2)] border-[var(--krat-border)] rounded-[var(--krat-radius)] shadow-none cursor-pointer hover:border-[rgba(59,130,246,0.3)] transition-colors text-left w-full">
          <CardContent className="p-4">
            {/* 헤더 */}
            <div className="flex items-start gap-2.5 mb-3">
              <RobotIcon subtype={robot.subtype} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold truncate">{robot.displayName}</div>
                <div className="text-[11px] text-[var(--krat-tx3)] font-mono">
                  {robot.serialNumber}
                </div>
              </div>
              <StatusBadge status={robot.status} />
            </div>

            {/* 통계 3열 */}
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              <StatBox
                value={`${robot.batteryPct}%`}
                label="배터리"
                color={getBatteryColor(robot.batteryPct)}
              />
              {isCleaning && isWet ? (
                <>
                  <StatBox
                    value={`${robot.cleanWaterPct ?? 0}%`}
                    label="청수"
                    color="text-[var(--krat-accent)]"
                  />
                  <StatBox
                    value={`${robot.dirtyWaterPct ?? 0}%`}
                    label="오수"
                    color={
                      (robot.dirtyWaterPct ?? 0) >= 80
                        ? "text-[var(--krat-red)]"
                        : "text-[var(--krat-tx2)]"
                    }
                  />
                </>
              ) : robot.coveragePct !== undefined ? (
                <>
                  <StatBox
                    value={`${robot.coveragePct}%`}
                    label="커버리지"
                    color={
                      robot.coveragePct >= 90
                        ? "text-[var(--krat-green)]"
                        : robot.coveragePct >= 50
                          ? "text-[var(--krat-amber)]"
                          : "text-[var(--krat-red)]"
                    }
                  />
                  <StatBox value={robot.firmwareVersion} label="펌웨어" />
                </>
              ) : (
                <>
                  <StatBox value={robot.firmwareVersion} label="펌웨어" />
                  <StatBox value="-" label="미션 없음" />
                </>
              )}
            </div>

            {/* 위치 */}
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--krat-tx2)] pt-2.5 border-t border-[var(--krat-border)]">
              <MapPin size={12} className="text-[var(--krat-tx3)] flex-shrink-0" />
              <span className="truncate">
                {robot.complexName} · {robot.zoneName}
              </span>
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-[var(--krat-bg3)] border-[var(--krat-border)] text-[var(--krat-tx2)] text-xs"
      >
        <p>{robot.manufacturer} · {robot.model}</p>
        <p className="font-mono text-[var(--krat-tx3)]">{robot.firmwareVersion}</p>
      </TooltipContent>
    </Tooltip>
  );
}
