"use client";

import { useState } from "react";

type Props = {
  value: string | number;
  className?: string;
};

/**
 * 값이 바뀔 때 파란 플래시 애니메이션을 재생하는 클라이언트 컴포넌트.
 *
 * React 권장 패턴: 렌더 중 state setter 호출로 이전 값과 비교해 animKey를 증가시키고,
 * key prop 변경으로 span을 리마운트해 CSS 애니메이션을 재트리거한다.
 */
export function AnimatedValue({ value, className = "" }: Props) {
  const [prevValue, setPrevValue] = useState(value);
  const [animKey, setAnimKey] = useState(0);

  // 값이 바뀌면 animKey 증가 → span 리마운트 → CSS 애니메이션 재생
  if (prevValue !== value) {
    setPrevValue(value);
    setAnimKey((k) => k + 1);
  }

  return (
    <span key={animKey} className={className}>
      {value}
    </span>
  );
}
