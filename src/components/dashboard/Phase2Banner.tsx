import type { JSX } from "react";
import { Lock } from "lucide-react";

export function Phase2Banner(): JSX.Element {
  const features = [
    "구역별 상세 뷰",
    "배터리/오염도 트렌드 차트",
    "청소 커버리지 히트맵",
    "입주민 상호작용 분석",
    "에너지 소비 비교",
    "주간/월간 리포트",
    "알림 규칙 엔진",
    "권한 세분화",
  ];

  return (
    <div className="relative glass-panel rounded-xl px-6 py-5 overflow-hidden border-dashed">
      {/* 배경 그리드 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
          <Lock size={16} className="text-krat-tx3" />
        </div>
        <div>
          <div className="text-[12px] font-bold text-krat-tx3 tracking-wide mb-1">
            Phase 2에서 추가될 영역
          </div>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1">
            {features.map((feature) => (
              <span
                key={feature}
                className="text-[11px] text-krat-tx3/60 after:content-['·'] after:ml-1.5 after:text-krat-tx3/30 last:after:content-none"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
