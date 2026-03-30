"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn, type AuthState } from "@/lib/auth/actions";
import { loginSchema, type LoginFormValues } from "@/lib/auth/schemas";

const initialState: AuthState = {};

// 콜백 실패 에러 메시지 매핑
const CALLBACK_ERRORS: Record<string, string> = {
  callback_failed:
    "이메일 인증 링크가 만료되었거나 올바르지 않습니다. 다시 시도해주세요.",
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [state, formAction, isPending] = useActionState(signIn, initialState);

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const errorMessage =
    state?.error ??
    (callbackError ? CALLBACK_ERRORS[callbackError] : undefined);

  return (
    <div className="bg-krat-bg2 border border-krat-border rounded-xl p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-krat-tx">로그인</h1>
        <p className="text-sm text-krat-tx3 mt-1">계정에 로그인하세요</p>
      </div>

      {/* 에러 배너 */}
      {errorMessage && (
        <div className="bg-krat-red-bg border border-krat-red/20 rounded-lg px-4 py-3 text-sm text-krat-red">
          {errorMessage}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* 이메일 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-krat-tx2">이메일</label>
          <input
            {...register("email")}
            name="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            className="w-full h-10 px-3 rounded-lg bg-krat-bg3 border border-krat-border text-sm text-krat-tx placeholder:text-krat-tx3 focus:outline-none focus:border-krat-accent focus:ring-1 focus:ring-krat-accent transition-colors"
          />
          {errors.email && (
            <p className="text-xs text-krat-red">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-krat-tx2">비밀번호</label>
          <input
            {...register("password")}
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full h-10 px-3 rounded-lg bg-krat-bg3 border border-krat-border text-sm text-krat-tx placeholder:text-krat-tx3 focus:outline-none focus:border-krat-accent focus:ring-1 focus:ring-krat-accent transition-colors"
          />
          {errors.password && (
            <p className="text-xs text-krat-red">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-10 rounded-lg bg-krat-accent hover:bg-krat-accent2 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="text-sm text-center text-krat-tx3">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="text-krat-accent hover:text-krat-accent2 font-medium transition-colors"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}
