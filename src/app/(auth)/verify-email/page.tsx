"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    if (!email || resending) return;

    setResending(true);
    setResendError("");

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setResending(false);

    if (error) {
      setResendError("메일 재발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } else {
      setResent(true);
    }
  };

  return (
    <div className="bg-krat-bg2 border border-krat-border rounded-xl p-8 space-y-6 text-center">
      {/* 아이콘 */}
      <div className="w-14 h-14 rounded-full bg-krat-accent/10 border border-krat-accent/20 flex items-center justify-center mx-auto">
        <Mail size={26} className="text-krat-accent" />
      </div>

      {/* 안내 문구 */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-krat-tx">
          이메일을 확인해주세요
        </h1>
        <p className="text-sm text-krat-tx3 leading-relaxed">
          {email ? (
            <>
              <span className="text-krat-tx font-medium">{email}</span>
              <br />
              으로 인증 링크를 발송했습니다.
            </>
          ) : (
            "가입하신 이메일로 인증 링크를 발송했습니다."
          )}
        </p>
        <p className="text-xs text-krat-tx3">
          메일의 링크를 클릭하면 로그인이 가능합니다.
          <br />
          메일이 오지 않으면 스팸함을 확인해주세요.
        </p>
      </div>

      {/* 재발송 영역 */}
      <div className="space-y-2">
        {resendError && (
          <p className="text-xs text-krat-red">{resendError}</p>
        )}

        {resent ? (
          <div className="flex items-center justify-center gap-2 text-sm text-krat-green">
            <CheckCircle2 size={15} />
            <span>인증 메일을 재발송했습니다.</span>
          </div>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending || !email}
            className="text-sm text-krat-accent hover:text-krat-accent2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {resending ? "발송 중..." : "인증 메일 다시 받기"}
          </button>
        )}
      </div>

      {/* 로그인 링크 */}
      <div className="pt-2 border-t border-krat-border">
        <Link
          href="/login"
          className="text-sm text-krat-tx3 hover:text-krat-tx transition-colors"
        >
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
