import { Badge } from "@/components/ui/badge";
import type { RobotStatus } from "@/lib/mock-data";

type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_MAP: Record<RobotStatus, StatusConfig> = {
  ONLINE: {
    label: "대기",
    className: "bg-[var(--krat-green-bg)] text-[var(--krat-green)] hover:bg-[var(--krat-green-bg)]",
  },
  IDLE: {
    label: "대기",
    className: "bg-[var(--krat-green-bg)] text-[var(--krat-green)] hover:bg-[var(--krat-green-bg)]",
  },
  WORKING: {
    label: "청소중",
    className: "bg-[var(--krat-purple-bg)] text-[var(--krat-purple)] hover:bg-[var(--krat-purple-bg)]",
  },
  CHARGING: {
    label: "충전중",
    className: "bg-[rgba(59,130,246,0.12)] text-[var(--krat-accent)] hover:bg-[rgba(59,130,246,0.12)]",
  },
  RETURNING: {
    label: "복귀중",
    className: "bg-[rgba(59,130,246,0.12)] text-[var(--krat-accent)] hover:bg-[rgba(59,130,246,0.12)]",
  },
  ERROR: {
    label: "에러",
    className: "bg-[var(--krat-red-bg)] text-[var(--krat-red)] hover:bg-[var(--krat-red-bg)]",
  },
  OFFLINE: {
    label: "오프라인",
    className: "bg-[rgba(255,255,255,0.06)] text-[var(--krat-tx3)] hover:bg-[rgba(255,255,255,0.06)]",
  },
  MANUAL: {
    label: "수동",
    className: "bg-[var(--krat-amber-bg)] text-[var(--krat-amber)] hover:bg-[var(--krat-amber-bg)]",
  },
  MAINTENANCE: {
    label: "점검중",
    className: "bg-[var(--krat-amber-bg)] text-[var(--krat-amber)] hover:bg-[var(--krat-amber-bg)]",
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
