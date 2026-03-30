import { Badge } from "@/components/ui/badge";
import type { RobotStatus } from "@/lib/mock-data";

type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_MAP: Record<RobotStatus, StatusConfig> = {
  ONLINE: {
    label: "대기",
    className: "bg-krat-green-bg text-krat-green hover:bg-krat-green-bg",
  },
  IDLE: {
    label: "대기",
    className: "bg-krat-green-bg text-krat-green hover:bg-krat-green-bg",
  },
  WORKING: {
    label: "청소중",
    className: "bg-krat-purple-bg text-krat-purple hover:bg-krat-purple-bg",
  },
  CHARGING: {
    label: "충전중",
    className: "bg-krat-accent/10 text-krat-accent hover:bg-krat-accent/10",
  },
  RETURNING: {
    label: "복귀중",
    className: "bg-krat-accent/10 text-krat-accent hover:bg-krat-accent/10",
  },
  ERROR: {
    label: "에러",
    className: "bg-krat-red-bg text-krat-red hover:bg-krat-red-bg",
  },
  OFFLINE: {
    label: "오프라인",
    className: "bg-white/[0.04] text-krat-tx3 hover:bg-white/[0.04]",
  },
  MANUAL: {
    label: "수동",
    className: "bg-krat-amber-bg text-krat-amber hover:bg-krat-amber-bg",
  },
  MAINTENANCE: {
    label: "점검중",
    className: "bg-krat-amber-bg text-krat-amber hover:bg-krat-amber-bg",
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
