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
      className: "bg-krat-purple-bg text-krat-purple hover:bg-krat-purple-bg",
      dotClass: "bg-krat-purple",
    },
    COMPLETED: {
      label: "완료",
      className: "bg-krat-green-bg text-krat-green hover:bg-krat-green-bg",
      dotClass: "bg-krat-green",
    },
    FAILED: {
      label: "실패",
      className: "bg-krat-red-bg text-krat-red hover:bg-krat-red-bg",
      dotClass: "bg-krat-red",
    },
    CANCELLED: {
      label: "취소",
      className: "bg-krat-bg4 text-krat-tx3 hover:bg-krat-bg4",
      dotClass: "bg-krat-tx3",
    },
    PAUSED: {
      label: "일시정지",
      className: "bg-krat-amber-bg text-krat-amber hover:bg-krat-amber-bg",
      dotClass: "bg-krat-amber",
    },
    SCHEDULED: {
      label: "예정",
      className: "bg-krat-accent/10 text-krat-accent hover:bg-krat-accent/10",
      dotClass: "bg-krat-accent",
    },
  };

  const c = config[status];
  return (
    <Badge className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border-0 gap-1.5 ${c.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dotClass} ${status === "IN_PROGRESS" ? "animate-pulse" : ""}`} />
      {c.label}
    </Badge>
  );
}

/** 커버리지 퍼센트 — 인라인 바 시각화 */
function CoverageBar({ value }: { value: number }): JSX.Element {
  const colorClass =
    value >= 90
      ? "bg-krat-green"
      : value >= 50
        ? "bg-krat-amber"
        : "bg-krat-red";

  const textColor =
    value >= 90
      ? "text-krat-green"
      : value >= 50
        ? "text-krat-amber"
        : "text-krat-red";

  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
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
    <TableRow className="border-white/[0.04] glass-table-row">
      <TableCell className="py-3 px-4">
        <div className="h-[14px] w-20 rounded bg-white/[0.04] animate-pulse opacity-40" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[12px] w-24 rounded bg-white/[0.04] animate-pulse opacity-40 mb-1" />
        <div className="h-[10px] w-16 rounded bg-white/[0.04] animate-pulse opacity-25" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[12px] w-20 rounded bg-white/[0.04] animate-pulse opacity-40" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[13px] w-10 rounded bg-white/[0.04] animate-pulse opacity-40" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[3px] w-full rounded-full bg-white/[0.04] animate-pulse opacity-40" />
      </TableCell>
      <TableCell className="py-3 px-4">
        <div className="h-[22px] w-14 rounded-md bg-white/[0.04] animate-pulse opacity-40" />
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
      <div className="flex-1 rounded-xl overflow-hidden glass-table-container">
        <Table>
          <TableHeader>
            <TableRow className="glass-table-header hover:bg-white/[0.03] border-white/[0.06]">
              {["로봇", "단지 / 구역", "시작", "면적", "커버리지", "상태"].map((h) => (
                <TableHead
                  key={h}
                  className="text-[10px] font-bold text-krat-tx3 uppercase tracking-[0.08em] py-3 px-4"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission, index) => (
              <TableRow
                key={mission.id}
                className="border-white/[0.04] glass-table-row animate-krat-row-in group"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-krat-tx">
                      {mission.robotName}
                    </span>
                    <ArrowUpRight
                      size={12}
                      className="text-krat-tx3 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="text-[12px] text-krat-tx2">{mission.complexName}</div>
                  <div className="text-[10px] text-krat-tx3">{mission.zoneName}</div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-[12px] font-mono text-krat-tx2 tabular-nums">
                    <Clock size={11} className="text-krat-tx3" />
                    {mission.startedAt
                      ? new Date(mission.startedAt).toLocaleString("ko-KR", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <span className="text-[13px] font-mono text-krat-tx tabular-nums">
                    {mission.areaCleaned}
                  </span>
                  <span className="text-[10px] text-krat-tx3 ml-0.5">m²</span>
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
