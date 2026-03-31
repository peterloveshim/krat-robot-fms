import type { JSX } from "react";
import { Building2, CircleDot } from "lucide-react";
import type { Complex } from "@/lib/mock-data";

type ComplexCardProps = {
  complex: Complex;
};

/** 단지별 로봇 비율을 시각화하는 도넛 차트 (CSS-only) */
function MiniDonut({
  operating,
  charging,
  error,
}: {
  operating: number;
  charging: number;
  error: number;
}): JSX.Element {
  const total = operating + charging + error;
  if (total === 0) {
    return (
      <div className="w-10 h-10 rounded-full border-2 border-white/[0.08] flex items-center justify-center">
        <span className="text-[9px] text-muted-foreground">0</span>
      </div>
    );
  }

  // conic-gradient 각도 계산
  const opDeg = (operating / total) * 360;
  const chDeg = (charging / total) * 360;

  return (
    <div
      className="w-10 h-10 rounded-full relative flex-shrink-0"
      style={{
        background: `conic-gradient(
          #00F5A0 0deg ${opDeg}deg,
          #00E5FF ${opDeg}deg ${opDeg + chDeg}deg,
          ${error > 0 ? "#FF3B5C" : "rgba(255,255,255,0.06)"} ${opDeg + chDeg}deg 360deg
        )`,
      }}
    >
      {/* 도넛 중앙 구멍 */}
      <div className="absolute inset-[3px] rounded-full flex items-center justify-center bg-card">
        <span className="text-[11px] font-bold text-foreground tabular-nums">{total}</span>
      </div>
    </div>
  );
}

/** 상태 인디케이터 도트 + 라벨 */
function StatusDot({
  count,
  label,
  colorClass,
}: {
  count: number;
  label: string;
  colorClass: string;
}): JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      <CircleDot size={8} className={colorClass} />
      <span className="text-[11px] text-muted-foreground tabular-nums">
        <span className="font-semibold">{count}</span>
        <span className="text-muted-foreground ml-0.5">{label}</span>
      </span>
    </div>
  );
}

export function ComplexCard({ complex }: ComplexCardProps): JSX.Element {
  const hasError = complex.robots.error > 0;

  return (
    <div
      className={`group relative bg-card border rounded-xl p-4 overflow-hidden ${
        hasError ? "border-destructive/30" : "border-border"
      }`}
    >
      {/* 에러 시 상단 경고 바 */}
      {hasError && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-destructive/50" />
      )}

      {/* 상단: 단지명 + 도넛 */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={13} className="text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] font-medium text-muted-foreground tracking-wide">
              {complex.district}
            </span>
          </div>
          <div className="text-[14px] font-bold text-foreground truncate">
            {complex.name}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {complex.subtypeLabel}
          </div>
        </div>
        <MiniDonut
          operating={complex.robots.operating}
          charging={complex.robots.charging}
          error={complex.robots.error}
        />
      </div>

      {/* 상태 분류 */}
      <div className="flex flex-col gap-1.5 pt-3 border-t border-border">
        <StatusDot
          count={complex.robots.operating}
          label="가동"
          colorClass="text-green-400"
        />
        <StatusDot
          count={complex.robots.charging}
          label="충전"
          colorClass="text-primary"
        />
        <StatusDot
          count={complex.robots.error}
          label="에러"
          colorClass={complex.robots.error > 0 ? "text-destructive" : "text-muted-foreground"}
        />
      </div>
    </div>
  );
}
