"use client";

import { useMqttStatus } from "@/hooks/useMqttStatus";
import type { MqttConnectionStatus } from "@/types/mqtt";

const STATUS_CONFIG: Record<
  MqttConnectionStatus,
  { color: string; label: string }
> = {
  connected: { color: "bg-green-400", label: "실시간 연결됨" },
  connecting: { color: "bg-amber-400 animate-pulse", label: "연결 중..." },
  disconnected: { color: "bg-muted-foreground", label: "연결 끊김" },
  error: { color: "bg-destructive", label: "연결 오류" },
  idle: { color: "bg-muted-foreground", label: "대기 중" },
};

export function MqttStatusIndicator() {
  const { status } = useMqttStatus();
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
      <span>{config.label}</span>
    </div>
  );
}
