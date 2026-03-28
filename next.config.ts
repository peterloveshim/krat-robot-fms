import type { NextConfig } from "next";

// NEXT_PUBLIC_MQTT_BROKER_URL의 ws(s):// → http:// 로 변환하여 rewrite destination으로 사용
const mqttBrokerUrl =
  process.env.NEXT_PUBLIC_MQTT_BROKER_URL ?? "ws://121.124.124.136:9001";
const mqttRewriteDestination = mqttBrokerUrl.replace(/^wss?:\/\//, "http://");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/mqtt-proxy",
        destination: mqttRewriteDestination,
      },
    ];
  },
};

export default nextConfig;
