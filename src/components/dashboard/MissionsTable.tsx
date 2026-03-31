import type { JSX } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { Clock, ArrowUpRight } from "lucide-react";
import type { Mission, MissionStatus } from "@/lib/mock-data";

function MissionStatusBadge({ status }: { status: MissionStatus }): JSX.Element {
  const config: Record<MissionStatus, { label: string; className: string; dotClass: string }> = {
    IN_PROGRESS: {
      label: "진행중",
      className: "bg-transparent border border-[#333] text-foreground hover:bg-transparent",
      dotClass: "bg-foreground",
    },
    COMPLETED: {
      label: "완료",
      className: "bg-transparent border border-[#2a2a2a] text-muted-foreground hover:bg-transparent",
      dotClass: "bg-muted-foreground",
    },
    FAILED: {
      label: "실패",
      className: "bg-transparent border border-destructive/40 text-destructive hover:bg-transparent",
      dotClass: "bg-destructive",
    },
    CANCELLED: {
      label: "취소",
      className: "bg-transparent border border-[#2a2a2a] text-muted-foreground hover:bg-transparent",
      dotClass: "bg-muted-foreground",
    },
    PAUSED: {
      label: "일시정지",
      className: "bg-transparent border border-[#444] text-muted-foreground hover:bg-transparent",
      dotClass: "bg-muted-foreground",
    },
    SCHEDULED: {
      label: "예정",
      className: "bg-transparent border border-[#333] text-foreground hover:bg-transparent",
      dotClass: "bg-foreground",
    },
  };

  const c = config[status];
  return (
    <Badge className={`text-[11px] font-semibold px-2 py-0.5 rounded-md gap-1.5 ${c.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dotClass}`} />
      {c.label}
    </Badge>
  );
}

/** 커버리지 퍼센트 — 인라인 바 시각화 */
function CoverageBar({ value }: { value: number }): JSX.Element {
  const colorClass =
    value >= 90
      ? "bg-green-400"
      : value >= 50
        ? "bg-amber-400"
        : "bg-destructive";

  const textColor =
    value >= 90
      ? "text-green-400"
      : value >= 50
        ? "text-amber-400"
        : "text-destructive";

  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-[12px] font-mono font-semibold tabular-nums ${textColor}`}>
        {value}%
      </span>
    </div>
  );
}

const MISSIONS_MAX = 10;

function MissionSkeletonRow(): JSX.Element {
  return (
    <TableRow className="border-border">
      <TableCell className="py-3 px-4">
        <div className="h-[14px] w-20 rounded bg-[#1a1a1a]" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[12px] w-24 rounded bg-[#1a1a1a] mb-1" />
        <div className="h-[10px] w-16 rounded bg-[#1a1a1a] opacity-60" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[12px] w-20 rounded bg-[#1a1a1a]" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[13px] w-10 rounded bg-[#1a1a1a]" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[3px] w-full rounded-full bg-[#1a1a1a]" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[22px] w-14 rounded-md bg-[#1a1a1a]" />
      </TableCell>
    </TableRow>
  );
}

type MissionsTableProps = { missions: Mission[] };

export function MissionsTable({ missions }: MissionsTableProps): JSX.Element {
  const skeletonCount = Math.max(0, MISSIONS_MAX - missions.length);

  return (
    <section className="h-full flex flex-col">
      <SectionHeader title="최근 미션" action="전체 보기 →" />
      <div className="flex-1 rounded-xl overflow-hidden bg-card border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/[0.02] border-border bg-[#141414]">
              {["로봇", "단지 / 구역", "시작", "면적", "커버리지", "상태"].map((h) => (
                <TableHead
                  key={h}
                  className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.08em] py-3 px-4"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow
                key={mission.id}
                className="border-border group"
              >
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-foreground">
                      {mission.robotName}
                    </span>
                    <ArrowUpRight
                      size={12}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="text-[12px] text-muted-foreground">{mission.complexName}</div>
                  <div className="text-[10px] text-muted-foreground/70">{mission.zoneName}</div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground tabular-nums">
                    <Clock size={11} className="text-muted-foreground/70" />
                    <span suppressHydrationWarning>
                      {mission.startedAt
                        ? new Date(mission.startedAt).toLocaleString("ko-KR", {
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <span className="text-[13px] font-mono text-foreground tabular-nums">
                    {mission.areaCleaned}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-0.5">m²</span>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <CoverageBar value={mission.coveragePct} />
                </TableCell>
                <TableCell className="py-3 px-4">
                  <MissionStatusBadge status={mission.status} />
                </TableCell>
              </TableRow>
            ))}
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <MissionSkeletonRow key={`skeleton-${i}`} />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
