# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**KRAT FMS (크라트로보틱스 Facility Management System)**
아파트 단지에 배치된 자율 서비스 로봇(청소/공기청정/보안)을 통합 관제하는 웹 대시보드.

- 고객사: 크라트로보틱스
- 스펙 문서: `docs/KRAT_FMS_Developer_Brief_v2.2.docx`
- DB 스키마: `docs/db_schema.sql`
- UI 레퍼런스: `docs/dashboard_example.html` (다크 테마)

> **현재 상태**: Phase 1 UI 구현 진행 중. 목업 데이터 기반 대시보드 완성. Supabase 연동 미완료.

---

## 도메인 모델 (핵심 4개 엔티티)

### 데이터 계층 구조

```
complexes (단지)
  └── zones (구역) ← 모든 운영 데이터의 앵커
        ├── zone_maps (SLAM맵 버전)
        ├── robots (로봇 마스터)
        │     ├── telemetry (실시간 텔레메트리, 월별 파티셔닝)
        │     ├── path_logs ★IP핵심★ (경로 로그, 월별 파티셔닝)
        │     ├── missions (미션/스케줄)
        │     ├── consumables (소모품)
        │     ├── incidents (장애)
        │     └── energy_logs ★IP핵심★ (에너지 효율)
        └── interaction_events (주민-로봇 조우)
```

### 로봇 분류

| category     | subtype                | 설명                     |
| ------------ | ---------------------- | ------------------------ |
| CLEANING     | WET_SCRUB / DRY_VACUUM | 라이온스봇 (미화 로봇)   |
| AIR_PURIFIER | NAMUX                  | 나무엑스 (공기청정 로봇) |
| SECURITY     | LYNX_M20               | 보안 로봇                |

### 24개 수집항목 (텔레메트리)

- **공통 (10초)**: 위치(lat/lng), zone_id, speed, battery, wifi_rssi
- **미화 전용**: floor_contamination(15s), clean/dirty_water_pct(5분)
- **공기청정 전용**: pm25, co2_ppm, tvoc_ppb, humidity, temperature_c(15s), sensor_node_id

---

## DB 설계 원칙

1. **구역 앵커**: 모든 운영 데이터는 `zones`를 중심으로 연결
2. **IP 핵심 테이블** (★ 표시된 것들은 비즈니스 가치 핵심):
   - `path_logs`: 경로 좌표 → SLAM맵 대비 커버리지율 산출
   - `energy_logs`: 에너지 효율 → ESG/전력비 리포트
3. **월별 파티셔닝**: `telemetry`, `path_logs`는 `captured_at` 기준 월별 파티션
4. **자동 갱신 트리거**:
   - 텔레메트리 INSERT → `robots` 실시간 상태 자동 갱신 (battery, location, last_seen_at)
   - 미션 완료 → `robots` 누적 통계 자동 갱신 (total_missions, total_area_m2, total_hours)
5. **Phase 2 예약**: zones의 JSONB 컬럼들(weather_override_json, seasonal_profile_json 등)은 Phase 2용 — 현재 UI에서 비활성화

---

## 기술스택

- Framework: Next.js v16 App Router
- Language: Typescript
- Style: Tailwindcss v4 (no tailwind config file)
- 상태관리: React Context API, nuqs(링크공유가 필요한 페이지에서 사용), zustand, localStorage(보안에 주의)
- React hook: native hook, usehooks-ts(https://github.com/dimitarnestorov/use-hooks)
- Component: shadcn/ui
- Form: React Hook Form + Zod
- Icon: lucide-react (https://lucide.dev/guide/react/getting-started)
- Supabase

### Tailwind v4 CSS 변수 사용 규칙

KRAT FMS 색상 토큰은 `globals.css`의 `@theme inline`에 등록되어 있다.
`bg-[var(--krat-xxx)]` 형태의 arbitrary value 사용 금지 — 반드시 Tailwind 유틸리티 클래스를 사용할 것.

```tsx
// ✅ Good — @theme inline 토큰 사용
<div className="bg-krat-bg text-krat-tx2 border-krat-border" />

// ❌ Bad — arbitrary var() 사용 금지 (IntelliSense warning 발생)
<div className="bg-[var(--krat-bg)] text-[var(--krat-tx2)]" />
```

**등록된 토큰 목록** (`bg-*` / `text-*` / `border-*` 등 모든 색상 유틸리티에서 사용 가능):

| 토큰                                             | 용도                    |
| ------------------------------------------------ | ----------------------- |
| `krat-bg` / `krat-bg2` / `krat-bg3` / `krat-bg4` | 배경 레이어 (어두운 순) |
| `krat-tx` / `krat-tx2` / `krat-tx3`              | 텍스트 (밝은 순)        |
| `krat-accent` / `krat-accent2`                   | 파란색 강조             |
| `krat-green` / `krat-green-bg`                   | 정상/활성 상태          |
| `krat-red` / `krat-red-bg`                       | 오류/위험 상태          |
| `krat-amber` / `krat-amber-bg`                   | 경고 상태               |
| `krat-purple` / `krat-purple-bg`                 | 보조 강조               |
| `krat-border`                                    | 구분선/테두리           |

### Supabase 설정 시 주의사항

- PostGIS 확장 필수: `CREATE EXTENSION IF NOT EXISTS "postgis";`
- 모든 14개 테이블에 RLS 활성화 필수
- Realtime 구독 대상: `robots`, `missions`, `incidents`, `interaction_events`
- `telemetry`, `path_logs`는 파티셔닝 테이블 — Supabase 직접 쿼리 사용

### 텔레메트리 수집 서비스

로봇 → MQTT/WebSocket → 수집 서버 → Supabase 삽입 (별도 서비스로 분리 예정)

---

## UI 레퍼런스

`docs/dashboard_example.html` 참고:

- 다크 테마 (#0f1117 배경, #7c6ef7 Primary, #22c55e 상태 색상)
- 폰트: Plus Jakarta Sans (UI), JetBrains Mono (수치)
- Phase 2 기능은 UI에서 비활성(disabled) 처리하여 존재감은 보여줄 것

## 개발 & 테스트 전략

### 기본 원칙

코드 작성 → 테스트 → 오류 수정 → 재테스트 사이클을 반복하여 완료 기준을 충족한다.

### 테스트 범위 규칙

- [**IMPORTANT**] 전체 테스트 스위트 실행 금지 — 개발한 내용과 사이드 이펙트가 예상되는 부분만 테스트
- 테스트 대상 선정 기준:
  1. **직접 변경한 컴포넌트/함수**
  2. **변경된 코드를 import하거나 호출하는 상위 컴포넌트**
  3. **공유 상태(Zustand store, Context)나 공통 훅을 함께 사용하는 인접 기능**

### 단계별 검증 절차

> [**IMPORTANT**] 코드 변경 완료 후 아래 순서를 반드시 모두 통과해야 한다.

```
1. npx tsc --noEmit  # TypeScript 오류 먼저 확인 (pnpm typecheck 미등록)
2. pnpm lint         # ESLint 오류 확인
3. pnpm build        # 프로덕션 빌드 성공 확인 (경고 포함 0 errors 필수)
4. Playwright MCP    # UI/기능 동작 확인 (변경 부분 + 사이드 이펙트 예상 영역)
5. 오류 발생 시 → 수정 → 1번부터 재실행
```

### 빌드 테스트 원칙

- [**IMPORTANT**] `pnpm build`는 커밋/PR 전 반드시 실행하여 빌드 성공을 확인할 것
- 빌드 경고(`⚠`)도 반드시 해소 — deprecated API, 파일 컨벤션 변경 등
- 빌드 오류는 typecheck/lint와 동일하게 즉시 수정 후 재빌드
- Next.js 버전 업 후에는 deprecated 경고 우선 해소 (파일 컨벤션 변경 등)

### Playwright MCP 활용

- UI 컴포넌트 또는 페이지 작업 완료 후 **반드시** Playwright MCP로 브라우저 동작 확인
- 확인 항목:
  - 렌더링 오류 없음 (콘솔 에러 확인)
  - 레이아웃/스타일이 `dashboard_example.html` 기준과 일치
  - 인터랙션(클릭, 입력, 라우팅) 정상 동작
  - 변경으로 인해 인접 UI가 깨지지 않았는지 스크린샷으로 확인
- Playwright MCP 사용 패턴:
  ```
  1. 개발 서버 실행 확인 (pnpm dev)
  2. 변경된 페이지/컴포넌트 navigate
  3. 콘솔 로그 및 네트워크 오류 확인
  4. 스크린샷 캡처하여 UI 검증
  5. 사이드 이펙트 예상 경로도 동일하게 확인
  ```

### 오류 처리 원칙

- 동일한 오류에 대해 동일한 접근 재시도 금지 — 원인을 파악하고 다른 방법으로 접근
- typecheck/lint 오류는 Playwright 검증 전에 반드시 해소
- Playwright에서 발견된 시각적 오류는 즉시 수정 후 해당 화면 재검증

---

## DB 운영 주의사항

### 파티션 테이블 INSERT 오류 처리

`telemetry`, `path_logs`는 월별 파티션 테이블이다. 해당 월의 파티션이 없으면 INSERT 시 오류가 발생한다.

- **오류 발생 시 처리 순서**: 파티션 테이블 생성 → INSERT 재시도
- 파티션 생성 예시 (2027년 1월 데이터 INSERT 전):

```sql
-- telemetry
CREATE TABLE IF NOT EXISTS telemetry_2027_01
    PARTITION OF telemetry FOR VALUES FROM ('2027-01-01') TO ('2027-02-01');

-- path_logs
CREATE TABLE IF NOT EXISTS path_logs_2027_01
    PARTITION OF path_logs FOR VALUES FROM ('2027-01-01') TO ('2027-02-01');
```

- 현재 스키마(`db_schema.sql`)는 2026-03 ~ 2026-12 파티션만 정의되어 있음. 2027년 이후 파티션은 INSERT 오류 발생 시 위 패턴으로 직접 생성할 것.

### UUID 배열 컬럼 데이터 정합성

`robots.assigned_zone_ids`와 `user_profiles.assigned_complex_ids`는 `UUID[]` 배열로, DB 레벨 FK가 없다.
참조 대상(zone, complex)을 **삭제할 때 반드시 애플리케이션에서 배열 정리 로직을 실행**해야 한다.

```ts
// 예: zone 삭제 전 robots.assigned_zone_ids 정리
await supabase.rpc("remove_zone_from_robots", { zone_id: deletedZoneId });

// 또는 직접 쿼리 (service_role)
await supabase
  .from("robots")
  .update({
    assigned_zone_ids: supabase.raw(
      "array_remove(assigned_zone_ids, ?::uuid)",
      [deletedZoneId],
    ),
  })
  .contains("assigned_zone_ids", [deletedZoneId]);
```

---

## 중요 참고

- [**IMPORTANT**] 보안 이슈가 있는 경우 매번 확인을 요청할 것
- [**IMPORTANT**] Phase1 까지만 개발할 것
- [**IMPORTANT**] 새로운 페이지나 컴포넌트 생성을 할 경우 `docs/dashboard_example.html`의 각 요소의 스타일을 절대 준수할 것
- 로그인 페이지에서 미리 입력한 비번, 패스워드 부분 수정하지 않기, 외부에서 미리 해당 이메일로 로그인하고 테스트해보기 위함
