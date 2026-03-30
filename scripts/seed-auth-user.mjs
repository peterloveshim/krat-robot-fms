#!/usr/bin/env node
/**
 * KRAT FMS Auth 시드 스크립트
 *
 * 테스트용 계정을 Supabase에 미리 생성합니다.
 * email_confirm: true 옵션으로 이메일 인증 없이 바로 active 상태로 생성됩니다.
 *
 * 실행: node scripts/seed-auth-user.mjs
 * 또는: pnpm seed:auth
 *
 * 필요 환경변수 (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env.local 파싱 (simulate.js와 동일한 패턴)
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const m = line.match(/^([^#\s][^=]*)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    });
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌ 환경변수 NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 없습니다.",
  );
  process.exit(1);
}

// Service Role Key로 admin 클라이언트 생성
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 생성할 테스트 계정 목록
const TEST_USERS = [
  {
    email: "test@gmail.com",
    password: "qwer1234",
    user_metadata: {
      full_name: "테스트 관리자",
      role: "ADMIN",
    },
  },
];

async function seedAuthUsers() {
  console.log("🔐 KRAT FMS Auth 시드 스크립트 시작\n");

  for (const user of TEST_USERS) {
    process.stdout.write(`  ⟳  ${user.email} 생성 중...`);

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // 이메일 인증 없이 바로 active 상태
      user_metadata: user.user_metadata,
    });

    if (error) {
      if (
        error.message.includes("already been registered") ||
        error.message.includes("already exists")
      ) {
        console.log(` ⚠  이미 존재하는 계정 (건너뜀)`);
      } else {
        console.log(` ✗  오류: ${error.message}`);
      }
      continue;
    }

    console.log(
      ` ✓  생성 완료 (id: ${data.user.id.slice(0, 8)}..., 이메일 확인: ${data.user.email_confirmed_at ? "완료" : "미완료"})`,
    );
  }

  console.log("\n✅ 시드 완료");
  console.log("   ID: test@gmail.com");
  console.log("   PW: qwer1234\n");
}

seedAuthUsers();
