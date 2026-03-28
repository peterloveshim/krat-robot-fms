"use client";

import { useCallback } from "react";
import { useMqttContext } from "@/lib/mqtt/context";

export interface UseMqttPublishReturn {
  publish: (topic: string, payload: string | object) => void;
  isConnected: boolean;
}

/**
 * MQTT 메시지 발행 훅.
 * object를 넘기면 자동으로 JSON.stringify 처리됨.
 *
 * @example
 * const { publish, isConnected } = useMqttPublish();
 * publish("robots/krat-01/command", { action: "pause" });
 */
export function useMqttPublish(): UseMqttPublishReturn {
  const { publish: ctxPublish, status } = useMqttContext();

  const publish = useCallback(
    (topic: string, payload: string | object) => {
      const message =
        typeof payload === "string" ? payload : JSON.stringify(payload);
      ctxPublish(topic, message);
    },
    [ctxPublish],
  );

  return {
    publish,
    isConnected: status === "connected",
  };
}
