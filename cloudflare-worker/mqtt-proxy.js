/**
 * Cloudflare Worker — MQTT WebSocket 프록시
 *
 * wss://your-worker.workers.dev  →  ws://121.124.124.136:9001
 *
 * 배포: wrangler deploy  또는  대시보드 인라인 에디터
 */

const MQTT_BROKER_URL = "ws://121.124.124.136:9001";

export default {
  async fetch(request) {
    const upgradeHeader = request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
      return new Response("MQTT WebSocket Proxy — Upgrade: websocket 필요", {
        status: 426,
      });
    }

    // 클라이언트 ↔ Worker WebSocket 쌍 생성
    const { 0: clientSocket, 1: serverSocket } = new WebSocketPair();
    serverSocket.accept();

    // Worker → MQTT 브로커: fetch() + Upgrade 헤더 사용 (2024 권장 패턴)
    const brokerResp = await fetch(MQTT_BROKER_URL, {
      headers: {
        Upgrade: "websocket",
        Connection: "Upgrade",
        // MQTT over WebSocket 프로토콜 식별자 — 반드시 전달해야 브로커가 수락함
        "Sec-WebSocket-Protocol": "mqtt",
      },
    });

    const brokerSocket = brokerResp.webSocket;
    if (!brokerSocket) {
      serverSocket.close(1011, "브로커 연결 실패");
      return new Response(null, { status: 101, webSocket: clientSocket });
    }
    brokerSocket.accept();

    // 클라이언트 → 브로커 릴레이
    serverSocket.addEventListener("message", ({ data }) => {
      if (brokerSocket.readyState === WebSocket.READY_STATE_OPEN) {
        brokerSocket.send(data);
      }
    });

    // 브로커 → 클라이언트 릴레이
    brokerSocket.addEventListener("message", ({ data }) => {
      if (serverSocket.readyState === WebSocket.READY_STATE_OPEN) {
        serverSocket.send(data);
      }
    });

    // 연결 종료 동기화
    serverSocket.addEventListener("close", ({ code, reason }) =>
      brokerSocket.close(code, reason),
    );
    brokerSocket.addEventListener("close", ({ code, reason }) =>
      serverSocket.close(code, reason),
    );

    // 오류 처리
    serverSocket.addEventListener("error", () => brokerSocket.close(1011));
    brokerSocket.addEventListener("error", () => serverSocket.close(1011));

    return new Response(null, {
      status: 101,
      headers: {
        // 브로커가 mqtt subprotocol을 수락했음을 클라이언트에 echo
        "Sec-WebSocket-Protocol": "mqtt",
      },
      webSocket: clientSocket,
    });
  },
};
