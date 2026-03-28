"use client";

import { useMqttContext } from "@/lib/mqtt/context";
import type { MqttConnectionStatus } from "@/types/mqtt";

export function useMqttStatus(): {
  status: MqttConnectionStatus;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
} {
  const { status, error } = useMqttContext();
  return {
    status,
    isConnected: status === "connected",
    isConnecting: status === "connecting",
    error,
  };
}
