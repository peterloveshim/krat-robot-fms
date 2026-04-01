"use client";

import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn, type AuthState } from "@/lib/auth/actions";
import { loginSchema, type LoginFormValues } from "@/lib/auth/schemas";

// URL 파라미터 에러 메시지 매핑
const CALLBACK_ERRORS: Record<string, string> = {
  callback_failed:
    "이메일 인증 링크가 만료되었거나 올바르지 않습니다. 다시 시도해주세요.",
  service_unavailable:
    "서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "test@gmail.com",
      password: "qwer1234",
    },
    resolver: zodResolver(loginSchema),
  });

  // RHF 검증 통과 시에만 Server Action 호출
  function onValid(data: LoginFormValues): void {
    setServerError(undefined);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", data.email);
      fd.set("password", data.password);
      const result: AuthState = await signIn({}, fd);
      if (result?.error) setServerError(result.error);
    });
  }

  const errorMessage =
    serverError ??
    (callbackError ? CALLBACK_ERRORS[callbackError] : undefined);

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">로그인</h1>
        <p className="text-sm text-muted-foreground mt-1">계정에 로그인하세요</p>
      </div>

      {/* 에러 배너 */}
      {errorMessage && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onValid)} className="space-y-4">
        {/* 이메일 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">이메일</label>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            disabled={isPending}
            className="w-full h-10 px-3 rounded-lg bg-background/[0.05] border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">비밀번호</label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isPending}
            className="w-full h-10 px-3 rounded-lg bg-background/[0.05] border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-10 rounded-lg bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold transition-colors"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
