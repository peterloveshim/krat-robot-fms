import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// 이메일 인증 링크 클릭 후 Supabase가 ?code=xxx 와 함께 이 URL로 리다이렉트
// Google OAuth 등 SNS 로그인 콜백도 동일한 code 방식으로 처리 가능
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 인증 완료 → 대시보드로 이동
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // 코드 없거나 교환 실패 → 로그인 페이지로
  return NextResponse.redirect(
    new URL("/login?error=callback_failed", requestUrl.origin),
  );
}
