"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean; // 초기 세션 확인 중 여부
  logout: () => void; // /api/auth/signout으로 full navigation (쿠키 제거 + 리다이렉트 원자적 처리)
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 초기 세션 확인 (AuthGuard와 중복되지만 user 상태 채우기 위해 필요)
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });

    // 실시간 인증 상태 변화 구독 (세션 만료 등 자동 반영)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(() => {
    // GET /api/auth/signout: 서버에서 쿠키 제거 → /login 리다이렉트 원자적 처리
    // router.push("/login") 먼저 호출하면 proxy.ts가 유효한 세션으로 /로 되돌림 (레이스 컨디션)
    window.location.href = "/api/auth/signout";
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
