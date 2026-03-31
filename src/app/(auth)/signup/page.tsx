"use client";

import { useActionState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { signUp, type AuthState } from "@/lib/auth/actions";
import {
  signupSchema,
  type SignupFormValues,
  passwordConditions,
} from "@/lib/auth/schemas";

const initialState: AuthState = {};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">회원가입</h1>
        <p className="text-sm text-muted-foreground mt-1">새 계정을 만드세요</p>
      </div>

      {/* 서버 에러 배너 */}
      {state?.error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* 이메일 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">이메일</label>
          <input
            {...register("email")}
            name="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            className="w-full h-10 px-3 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 focus:ring-0 transition-colors"
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
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full h-10 px-3 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 focus:ring-0 transition-colors"
          />

          {/* 비밀번호 조건 안내 */}
          <div className="bg-[#141414] border border-border rounded-lg p-3 space-y-1.5">
            <p className="text-xs text-muted-foreground mb-2">비밀번호 조건</p>
            {passwordConditions.map((condition) => {
              const met = condition.test(passwordValue);
              return (
                <div
                  key={condition.label}
                  className="flex items-center gap-2"
                >
                  {met ? (
                    <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle size={13} className="text-muted-foreground flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs transition-colors ${
                      met ? "text-green-400" : "text-muted-foreground"
                    }`}
                  >
                    {condition.label}
                  </span>
                </div>
              );
            })}
          </div>

          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            비밀번호 확인
          </label>
          <input
            {...register("confirmPassword")}
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full h-10 px-3 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 focus:ring-0 transition-colors"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-10 rounded-lg bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold transition-colors"
        >
          {isPending ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
