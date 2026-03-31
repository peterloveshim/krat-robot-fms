"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string | number;
  className?: string;
};

/**
 * 값이 바뀔 때 플래시 애니메이션을 재생하는 클라이언트 컴포넌트.
 * useEffect로 값 변화를 감지해 렌더 중 setState 호출(추가 렌더 사이클)을 제거함.
 */
export function AnimatedValue({ value, className = "" }: Props) {
  const [animKey, setAnimKey] = useState(0);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value;
      setAnimKey((k) => k + 1);
    }
  }, [value]);

  return (
    <span key={animKey} className={className}>
      {value}
    </span>
  );
}
