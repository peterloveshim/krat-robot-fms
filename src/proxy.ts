import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 인증 없이 접근 가능한 경로
const PUBLIC_PATHS = ["/login", "/signup", "/verify-email", "/auth/callback"];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 쿠키 갱신을 위한 클라이언트 (세션 쿠키 read/write)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // getSession(): 쿠키만 읽지만 토큰 만료 시 갱신 네트워크 콜 발생 → 블로킹 방지용 3초 타임아웃
  // 타임아웃 시 화면 먼저 출력 → AuthGuard(클라이언트)가 getUser()로 인증 확인
  const TIMED_OUT = Symbol("timeout");
  let session = null;
  try {
    const result = await Promise.race([
      supabase.auth.getSession().then((r) => r.data.session),
      new Promise<typeof TIMED_OUT>((resolve) =>
        setTimeout(() => resolve(TIMED_OUT), 3_000),
      ),
    ]);

    if (result === TIMED_OUT) {
      // 타임아웃: 블로킹 없이 화면 즉시 출력, AuthGuard가 인증 처리
      return supabaseResponse;
    }
    session = result;
  } catch {
    if (!isPublicPath) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", "service_unavailable");
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // 미인증 + 보호 경로 → /login 리다이렉트
  if (!session && !isPublicPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // 이미 인증된 상태로 /login 또는 /signup 접근 → 대시보드 리다이렉트
  if (session && (pathname === "/login" || pathname === "/signup")) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // 정적 파일, Next.js 내부 경로, 이미지 파일 제외
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
