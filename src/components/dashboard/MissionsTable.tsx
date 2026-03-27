import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ui/score-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { missions } from "@/lib/mock-data";
import type { MissionStatus } from "@/lib/mock-data";

function MissionStatusBadge({ status }: { status: MissionStatus }) {
  const config: Record<MissionStatus, { label: string; className: string }> = {
    IN_PROGRESS: {
      label: "진행중",
      className: "bg-[var(--krat-purple-bg)] text-[var(--krat-purple)] hover:bg-[var(--krat-purple-bg)]",
    },
    COMPLETED: {
      label: "완료",
      className: "bg-[var(--krat-green-bg)] text-[var(--krat-green)] hover:bg-[var(--krat-green-bg)]",
    },
    FAILED: {
      label: "실패",
      className: "bg-[var(--krat-red-bg)] text-[var(--krat-red)] hover:bg-[var(--krat-red-bg)]",
    },
    CANCELLED: {
      label: "취소",
      className: "bg-[rgba(255,255,255,0.06)] text-[var(--krat-tx3)] hover:bg-[rgba(255,255,255,0.06)]",
    },
    PAUSED: {
      label: "일시정지",
      className: "bg-[var(--krat-amber-bg)] text-[var(--krat-amber)] hover:bg-[var(--krat-amber-bg)]",
    },
    SCHEDULED: {
      label: "예정",
      className: "bg-[rgba(59,130,246,0.12)] text-[var(--krat-accent)] hover:bg-[rgba(59,130,246,0.12)]",
    },
  };

  const c = config[status];
  return (
    <Badge className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${c.className}`}>
      {c.label}
    </Badge>
  );
}

export function MissionsTable() {
  return (
    <section className="mb-7">
      <SectionHeader title="최근 미션" action="전체 보기 →" />
      <div className="rounded-[var(--krat-radius)] border border-[var(--krat-border)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--krat-bg3)] hover:bg-[var(--krat-bg3)] border-[var(--krat-border)]">
              {["로봇", "단지", "구역", "시작", "면적", "커버리지", "상태"].map((h) => (
                <TableHead
                  key={h}
                  className="text-[11px] font-semibold text-[var(--krat-tx3)] uppercase tracking-[0.05em] py-3"
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
                className="border-[var(--krat-border)] hover:bg-[rgba(255,255,255,0.02)] bg-[var(--krat-bg2)]"
              >
                <TableCell className="text-[13px] font-semibold py-3">
                  {mission.robotName}
                </TableCell>
                <TableCell className="text-[13px] text-[var(--krat-tx2)] py-3">
                  {mission.complexName}
                </TableCell>
                <TableCell className="text-[13px] text-[var(--krat-tx2)] py-3">
                  {mission.zoneName}
                </TableCell>
                <TableCell className="text-[12px] font-mono text-[var(--krat-tx2)] py-3">
                  {mission.startedAt}
                </TableCell>
                <TableCell className="text-[13px] text-[var(--krat-tx2)] py-3">
                  {mission.areaCleaned} m²
                </TableCell>
                <TableCell className="py-3">
                  <ScoreBadge value={mission.coveragePct} />
                </TableCell>
                <TableCell className="py-3">
                  <MissionStatusBadge status={mission.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
