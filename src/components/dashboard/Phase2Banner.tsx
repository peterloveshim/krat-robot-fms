export function Phase2Banner() {
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
    <div className="border border-dashed border-[var(--krat-border)] rounded-[var(--krat-radius)] bg-[var(--krat-bg3)] px-5 py-5 text-center mt-6">
      <div className="text-[13px] font-semibold text-[var(--krat-tx3)] mb-1.5">
        Phase 2에서 추가될 영역
      </div>
      <div className="text-[12px] text-[var(--krat-tx3)] opacity-60">
        {features.join(" · ")}
      </div>
    </div>
  );
}
