"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/lib/auth/errors";

export type AuthState = {
  error?: string;
};

// 로그인
export async function signIn(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect("/");
}

// 회원가입
export async function signUp(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // 이메일 인증 링크 클릭 후 리다이렉트될 URL
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  // 이메일 인증 안내 페이지로 이동 (이메일 재발송에 사용)
  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

// 로그아웃
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// -- SNS(OAuth) 로그인 향후 확장용 --
// export async function signInWithOAuth(
//   provider: "google" | "github"
// ): Promise<AuthState> {
//   const supabase = await createClient();
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider,
//     options: {
//       redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
//     },
//   });
//   if (error) return { error: "소셜 로그인 중 오류가 발생했습니다." };
//   if (data.url) redirect(data.url);
//   return {};
// }
