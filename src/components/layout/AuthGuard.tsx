"use client";

import { useEffect, useState, type ReactNode } from "react";
import { WifiOff, RefreshCw, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// "checking" : 백그라운드 인증 확인 중 → children 즉시 렌더링
// "error"    : 네트워크 오류/타임아웃 → 전체 화면 에러
type AuthState = "checking" | "error";

export function AuthGuard({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>("checking");

  function runCheck() {
    const supabase = createClient();

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 3_000),
    );

    Promise.race([supabase.auth.getUser(), timeout])
      .then(({ data }) => {
        if (!data.user) {
          // 세션 무효 → 서버 사이드 signout으로 쿠키 제거 후 /login
          window.location.href = "/api/auth/signout";
        }
        // 인증 확인 완료 → 이미 children이 표시 중이므로 상태 변경 불필요
      })
      .catch(() => {
        // 타임아웃 또는 네트워크 오류 → 전체 화면 에러로 전환
        setAuthState("error");
      });
  }

  useEffect(() => { runCheck(); }, []);

  // 에러: 전체 화면 (네트워크 문제 확인 필요)
  if (authState === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-black text-sm font-extrabold shrink-0">
            K
          </div>
          <div>
            <div className="text-[15px] font-extrabold tracking-[-0.02em]">KRAT FMS</div>
            <div className="text-[9px] text-muted-foreground font-mono tracking-wider">v2.2 PHASE 1</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-krat-red-bg flex items-center justify-center">
            <WifiOff className="text-krat-red" size={22} />
          </div>
          <p className="text-foreground font-semibold">서비스에 연결할 수 없습니다</p>
          <p className="text-muted-foreground text-sm max-w-[260px]">
            서버 응답이 없습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-[200px]">
          <button
            onClick={() => { setAuthState("checking"); runCheck(); }}
            className="flex items-center justify-center gap-2 h-9 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            <RefreshCw size={14} />
            다시 시도
          </button>
          <button
            onClick={() => { window.location.href = "/api/auth/signout"; }}
            className="flex items-center justify-center gap-2 h-9 rounded-lg bg-krat-bg3 border border-krat-border text-krat-tx2 text-sm hover:text-krat-tx transition-colors"
          >
            <LogIn size={14} />
            로그인 페이지로
          </button>
        </div>
      </div>
    );
  }

  // checking 중에도 children 즉시 렌더링 (인증은 백그라운드에서 확인)
  return <>{children}</>;
}
