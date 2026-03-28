"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMqttContext } from "@/lib/mqtt/context";
import type { MqttMessageCallback, UseMqttSubscribeOptions } from "@/types/mqtt";

/**
 * MQTT 토픽을 구독하고 메시지를 수신하는 훅.
 * 컴포넌트 언마운트 시 자동으로 구독 해제됨.
 *
 * @param topic    구독할 MQTT 토픽 (와일드카드 + / # 지원)
 * @param callback 메시지 수신 시 호출될 콜백
 * @param options  enabled (기본 true)
 *
 * @example
 * const handleMessage = useCallback((_topic, payload) => {
 *   const data = JSON.parse(payload);
 *   setRobotStatus(data.status);
 * }, []);
 *
 * useMqttSubscribe(`robots/${robot.id}/status`, handleMessage);
 */
export function useMqttSubscribe(
  topic: string,
  callback: MqttMessageCallback,
  options: UseMqttSubscribeOptions = {},
): void {
  const { enabled = true } = options;
  const { subscribe, unsubscribe } = useMqttContext();

  // 최신 callback을 ref에 보관하여 구독/해제 의존성에서 제외
  // 인라인 함수를 넘겨도 구독이 반복 재등록되지 않음
  const callbackRef = useRef<MqttMessageCallback>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  // 마운트 시 1회만 생성되는 안정된 래퍼 콜백
  const stableCallback = useCallback<MqttMessageCallback>(
    (topic, payload, raw) => {
      callbackRef.current(topic, payload, raw);
    },
    [], // 의존성 없음
  );

  useEffect(() => {
    if (!enabled) return;
    subscribe(topic, stableCallback);
    return () => {
      unsubscribe(topic, stableCallback);
    };
  }, [topic, enabled, subscribe, unsubscribe, stableCallback]);
}
