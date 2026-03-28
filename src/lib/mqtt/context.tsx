"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  MqttContextValue,
  MqttConnectionStatus,
  MqttMessageCallback,
} from "@/types/mqtt";
import { getMqttClient, setMqttClient } from "@/lib/mqtt/singleton";

const MqttContext = createContext<MqttContextValue>({
  status: "idle",
  error: null,
  subscribe: () => {},
  unsubscribe: () => {},
  publish: () => {},
});

// MQTT 와일드카드 토픽 매칭
// "robots/+/status" → "robots/krat-01/status" 매칭
// "robots/#"        → "robots/krat-01/status/battery" 매칭
function topicMatches(filter: string, topic: string): boolean {
  if (filter === topic) return true;
  const filterParts = filter.split("/");
  const topicParts = topic.split("/");

  for (let i = 0; i < filterParts.length; i++) {
    if (filterParts[i] === "#") return true;
    if (filterParts[i] !== "+" && filterParts[i] !== topicParts[i])
      return false;
  }
  return filterParts.length === topicParts.length;
}

interface MqttProviderProps {
  children: ReactNode;
  brokerUrl?: string;
}

export function MqttProvider({ children, brokerUrl }: MqttProviderProps) {
  const [status, setStatus] = useState<MqttConnectionStatus>("idle");
  const [error, setError] = useState<Error | null>(null);

  // topic → Set<callback> 라우팅 맵 (ref: 구독 변경 시 리렌더링 없음)
  const listeners = useRef<Map<string, Set<MqttMessageCallback>>>(new Map());
  const clientRef = useRef<import("mqtt").MqttClient | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // StrictMode double-invoke 시 기존 클라이언트 재사용
    const existing = getMqttClient();
    if (existing) {
      clientRef.current = existing;
      setStatus(existing.connected ? "connected" : "connecting");
      attachEventHandlers(existing);
      return;
    }

    // 동적 import: mqtt가 서버 번들에 포함되지 않도록
    // CJS/ESM 인터롭: connect는 named export 또는 default.connect에 위치
    import("mqtt").then((mod) => {
      const connect =
        (mod as { connect?: typeof import("mqtt").connect }).connect ??
        (mod.default as unknown as { connect: typeof import("mqtt").connect })
          ?.connect;
      if (!connect) {
        console.error("[MQTT] connect 함수를 찾을 수 없습니다.");
        return;
      }
      // https 환경에서는 wss:// 만 허용되므로 Next.js rewrite 프록시 경로 사용
      // /mqtt-proxy → next.config.ts rewrite → ws://broker
      const url =
        brokerUrl ??
        (window.location.protocol === "https:"
          ? `wss://${window.location.host}/mqtt-proxy`
          : (process.env.NEXT_PUBLIC_MQTT_BROKER_URL ??
            "ws://121.124.124.136:9001"));
      const mqttClient = connect(url, {
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
        clientId: `krat-fms-${Math.random().toString(36).slice(2, 9)}`,
        clean: true,
        reconnectPeriod: 5_000,
        connectTimeout: 10_000,
        keepalive: 30,
      });

      setMqttClient(mqttClient);
      clientRef.current = mqttClient;
      setStatus("connecting");
      attachEventHandlers(mqttClient);
    });

    return () => {
      // 개발 StrictMode unmount/remount 시 disconnect 하지 않음
      // 싱글톤이 살아있으므로 재마운트 시 재사용됨
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function attachEventHandlers(mqttClient: import("mqtt").MqttClient) {
    mqttClient.on("connect", () => {
      setStatus("connected");
      setError(null);
      // 재연결 시 기존 구독 토픽 전체 재구독
      listeners.current.forEach((_, topic) => {
        mqttClient.subscribe(topic);
      });
    });

    mqttClient.on("disconnect", () => setStatus("disconnected"));
    mqttClient.on("offline", () => setStatus("disconnected"));
    mqttClient.on("error", (err) => {
      setStatus("error");
      setError(err);
    });
    mqttClient.on("reconnect", () => setStatus("connecting"));

    mqttClient.on("message", (topic, payload) => {
      const payloadStr = payload.toString("utf-8");
      listeners.current.forEach((callbacks, subscribedTopic) => {
        if (topicMatches(subscribedTopic, topic)) {
          callbacks.forEach((cb) => cb(topic, payloadStr, payload));
        }
      });
    });
  }

  const subscribe = useCallback(
    (topic: string, callback: MqttMessageCallback) => {
      const map = listeners.current;
      if (!map.has(topic)) {
        map.set(topic, new Set());
        // 이미 연결된 경우 즉시 SUBSCRIBE 패킷 전송
        // 미연결 시 connect 이벤트에서 일괄 재구독
        if (clientRef.current?.connected) {
          clientRef.current.subscribe(topic);
        }
      }
      map.get(topic)!.add(callback);
    },
    [],
  );

  const unsubscribe = useCallback(
    (topic: string, callback: MqttMessageCallback) => {
      const callbacks = listeners.current.get(topic);
      if (!callbacks) return;
      callbacks.delete(callback);
      // 해당 토픽 구독자가 없을 때만 브로커에 UNSUBSCRIBE 전송
      if (callbacks.size === 0) {
        listeners.current.delete(topic);
        clientRef.current?.unsubscribe(topic);
      }
    },
    [],
  );

  const publish = useCallback((topic: string, payload: string | Buffer) => {
    if (!clientRef.current?.connected) {
      console.warn("[MQTT] publish 실패: 연결 없음", topic);
      return;
    }
    clientRef.current.publish(topic, payload);
  }, []);

  return (
    <MqttContext.Provider
      value={{ status, error, subscribe, unsubscribe, publish }}
    >
      {children}
    </MqttContext.Provider>
  );
}

export function useMqttContext(): MqttContextValue {
  return useContext(MqttContext);
}
