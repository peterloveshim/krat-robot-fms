"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// 서버 데이터를 주기적으로 재요청하여 실시간 갱신 효과 구현
const INTERVAL_MS = 8_000; // 8초

export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [router]);

  return null;
}
