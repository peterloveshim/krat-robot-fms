"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useMqttSubscribe } from "@/hooks/useMqttSubscribe";
import { MQTT_TOPICS, type SensorTemperaturePayload } from "@/types/mqtt";

export function useSensorTemperature() {
  const [data, setData] = useState<SensorTemperaturePayload | null>(null);

  const handleMessage = useCallback((_topic: string, payload: string) => {
    try {
      const parsed = JSON.parse(payload) as SensorTemperaturePayload;
      setData(parsed);

      const id = toast("센서 데이터 수신", {
        description: `${parsed.sensorId} · 온도 ${parsed.temperature}°C · 습도 ${parsed.humidity}% · #${parsed.sequence}`,
        duration: 10000,
        action: {
          label: "확인",
          onClick: () => toast.dismiss(id),
        },
      });
    } catch {
      console.error("[MQTT] sensor/temperature 파싱 실패", payload);
    }
  }, []);

  useMqttSubscribe(MQTT_TOPICS.sensorTemperature, handleMessage);

  return data;
}
