import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// AuthGuard에서 세션이 무효임을 감지했을 때 서버 사이드 signout 처리
// 브라우저 클라이언트 signOut은 서버 설정 쿠키(path/domain 포함)를 정확히 삭제 못할 수 있어
// 이 라우트를 거쳐야 Set-Cookie로 쿠키가 확실히 제거됨
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

// Optimistic logout에서 fire-and-forget으로 호출
// 브라우저가 이미 /login으로 이동한 상태에서 백그라운드로 서버 쿠키 제거
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
