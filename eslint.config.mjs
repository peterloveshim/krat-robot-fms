import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Node.js 스크립트 — TypeScript/React 규칙 미적용
    "scripts/**",
    // Cloudflare Worker — Next.js ESLint 규칙 미적용
    "cloudflare-worker/**",
  ]),
]);

export default eslintConfig;
