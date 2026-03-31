import { Badge } from "@/components/ui/badge";
import type { RobotStatus } from "@/lib/mock-data";

type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_MAP: Record<RobotStatus, StatusConfig> = {
  ONLINE: {
    label: "대기",
    className: "bg-green-400/10 text-green-400 hover:bg-green-400/10",
  },
  IDLE: {
    label: "대기",
    className: "bg-green-400/10 text-green-400 hover:bg-green-400/10",
  },
  WORKING: {
    label: "청소중",
    className: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/10",
  },
  CHARGING: {
    label: "충전중",
    className: "bg-primary/10 text-primary hover:bg-primary/10",
  },
  RETURNING: {
    label: "복귀중",
    className: "bg-primary/10 text-primary hover:bg-primary/10",
  },
  ERROR: {
    label: "에러",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/10",
  },
  OFFLINE: {
    label: "오프라인",
    className: "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.04]",
  },
  MANUAL: {
    label: "수동",
    className: "bg-amber-400/10 text-amber-400 hover:bg-amber-400/10",
  },
  MAINTENANCE: {
    label: "점검중",
    className: "bg-amber-400/10 text-amber-400 hover:bg-amber-400/10",
  },
};

type StatusBadgeProps = {
  status: RobotStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status];
  return (
    <Badge
      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${config.className} ${className ?? ""}`}
    >
      {config.label}
    </Badge>
  );
}
