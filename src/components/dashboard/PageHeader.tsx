"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Activity, Radio } from "lucide-react";

function LiveClock(): JSX.Element {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    function update(): void {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "short",
        })
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* 타임스탬프 블록 */}
      <div className="text-right">
        <div className="text-[11px] text-muted-foreground font-medium tracking-wide">
          {date}
        </div>
        <div className="text-[18px] font-mono font-bold text-foreground tracking-wider leading-tight tabular-nums">
          {time}
        </div>
      </div>
      {/* LIVE 인디케이터 — 글로우 효과 강화 */}
      <div className="flex flex-col items-center gap-1 pl-3 border-l border-white/[0.08]">
        <div className="relative">
          <span className="animate-pulse block w-2 h-2 rounded-full bg-green-400" />
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-40 animate-ping" />
        </div>
        <span className="text-[9px] font-bold tracking-[0.15em] text-green-400 uppercase">
          live
        </span>
      </div>
    </div>
  );
}

export function PageHeader(): JSX.Element {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      {/* 좌측 — 타이틀 블록 */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity size={14} className="text-muted-foreground" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Fleet Management System
          </span>
        </div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-foreground leading-none">
          통합 관제 대시보드
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Radio size={12} className="text-muted-foreground" />
          <p className="text-[12px] text-muted-foreground">
            8개 단지 · 15대 로봇 실시간 모니터링
          </p>
        </div>
      </div>

      {/* 우측 — 시계 + 상태 */}
      <div className="flex-shrink-0 border border-border rounded-xl px-4 py-2.5 bg-card">
        <LiveClock />
      </div>
    </div>
  );
}
