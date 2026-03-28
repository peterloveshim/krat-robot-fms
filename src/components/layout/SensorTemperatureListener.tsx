"use client";

import { useSensorTemperature } from "@/hooks/useSensorTemperature";

// UI 없이 sensor/temperature 구독만 활성화하는 컴포넌트
export function SensorTemperatureListener() {
  useSensorTemperature();
  return null;
}
