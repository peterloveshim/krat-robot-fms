"use client";

import { useMqttStatus } from "@/hooks/useMqttStatus";
import type { MqttConnectionStatus } from "@/types/mqtt";

const STATUS_CONFIG: Record<
  MqttConnectionStatus,
  { color: string; label: string }
> = {
  connected: { color: "bg-krat-green", label: "실시간 연결됨" },
  connecting: { color: "bg-krat-amber animate-pulse", label: "연결 중..." },
  disconnected: { color: "bg-krat-tx3", label: "연결 끊김" },
  error: { color: "bg-krat-red", label: "연결 오류" },
  idle: { color: "bg-krat-tx3", label: "대기 중" },
};

export function MqttStatusIndicator() {
  const { status } = useMqttStatus();
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-1.5 text-xs text-krat-tx3">
      <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
      <span>{config.label}</span>
    </div>
  );
}
