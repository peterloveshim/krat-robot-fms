export type MqttConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type MqttMessageCallback = (
  topic: string,
  payload: string,
  raw: Buffer,
) => void;

export interface MqttContextValue {
  status: MqttConnectionStatus;
  error: Error | null;
  subscribe: (topic: string, callback: MqttMessageCallback) => void;
  unsubscribe: (topic: string, callback: MqttMessageCallback) => void;
  publish: (topic: string, payload: string | Buffer) => void;
}

export interface UseMqttSubscribeOptions {
  enabled?: boolean;
  qos?: 0 | 1 | 2;
}

export const MQTT_TOPICS = {
  robotStatus: (robotId: string) => `robots/${robotId}/status`,
  robotBattery: (robotId: string) => `robots/${robotId}/battery`,
  robotTelemetry: (robotId: string) => `robots/${robotId}/telemetry`,
  robotAll: "robots/#",
  missionUpdate: "missions/+/update",
  sensorTemperature: "sensor/temperature",
} as const;

// sensor/temperature 토픽 페이로드
export type SensorTemperaturePayload = {
  sensorId: string;
  temperature: number;
  humidity: number;
  timestamp: string;
  sequence: number;
};
