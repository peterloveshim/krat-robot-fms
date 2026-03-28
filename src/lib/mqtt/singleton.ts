"use client";

import type { MqttClient } from "mqtt";

// 모듈 스코프 싱글톤: 브라우저에서 단 1개의 mqtt.Client만 유지
// React.StrictMode double-invoke 시 기존 연결 재사용 가능
let client: MqttClient | null = null;

export const getMqttClient = (): MqttClient | null => client;
export const setMqttClient = (c: MqttClient): void => {
  client = c;
};
export const clearMqttClient = (): void => {
  client = null;
};
