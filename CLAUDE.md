# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**KRAT FMS (크라트로보틱스 Facility Management System)**
아파트 단지에 배치된 자율 서비스 로봇(청소/공기청정/보안)을 통합 관제하는 웹 대시보드.

- 고객사: 크라트로보틱스
- 스펙 문서: `docs/KRAT_FMS_Developer_Brief_v2.2.docx`
- DB 스키마: `docs/db_schema.sql` (v4, 14테이블)
- UI 레퍼런스: `docs/dashboard_example.html` (다크 테마)

> **현재 상태**: 설계/문서화 단계. 애플리케이션 코드 미존재. 스키마 v4 기준으로 개발 시작.

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

- Next.js v16 App Router
- Typescript
- Tailwindcss v4 (no tailwind config file)
- shadcn/ui
- lucide-react (https://lucide.dev/guide/react/getting-started)
- Supabase

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

## 중요 참고

- [**IMPORTANT**] Phase1 까지만 개발할 것
- [**IMPORTANT**] 새로운 페이지나 컴포넌트 생성을 할 경우 `docs/dashboard_example.html`의 각 요소의 스타일을 절대 준수할 것
