import { Badge } from "@/components/ui/badge";
import type { RobotStatus } from "@/lib/mock-data";

type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_MAP: Record<RobotStatus, StatusConfig> = {
  ONLINE: {
    label: "대기",
    className: "bg-transparent border border-[#1a3a1a] text-[#34d058] hover:bg-transparent",
  },
  IDLE: {
    label: "대기",
    className: "bg-transparent border border-[#1a3a1a] text-[#34d058] hover:bg-transparent",
  },
  WORKING: {
    label: "청소중",
    className: "bg-transparent border border-[#333] text-foreground hover:bg-transparent",
  },
  CHARGING: {
    label: "충전중",
    className: "bg-transparent border border-[#333] text-muted-foreground hover:bg-transparent",
  },
  RETURNING: {
    label: "복귀중",
    className: "bg-transparent border border-[#333] text-muted-foreground hover:bg-transparent",
  },
  ERROR: {
    label: "에러",
    className: "bg-transparent border border-destructive/50 text-destructive hover:bg-transparent",
  },
  OFFLINE: {
    label: "오프라인",
    className: "bg-transparent border border-border text-muted-foreground hover:bg-transparent",
  },
  MANUAL: {
    label: "수동",
    className: "bg-transparent border border-[#4a3800] text-[#e5a020] hover:bg-transparent",
  },
  MAINTENANCE: {
    label: "점검중",
    className: "bg-transparent border border-[#4a3800] text-[#e5a020] hover:bg-transparent",
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
      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${config.className} ${className ?? ""}`}
    >
      {config.label}
    </Badge>
  );
}
