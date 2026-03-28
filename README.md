# KRAT FMS — 크라트로보틱스 시설 관제 시스템

아파트 단지에 배치된 자율 서비스 로봇(청소 / 공기청정 / 보안)을 통합 관제하는 웹 대시보드입니다.

---

## 기술 스택

| 구분      | 기술                             |
| --------- | -------------------------------- |
| Framework | Next.js 16 (App Router)          |
| Language  | TypeScript                       |
| Styling   | Tailwind CSS v4 + shadcn/ui      |
| Database  | Supabase (PostgreSQL + Realtime) |
| Icons     | lucide-react                     |

---

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

`.env.example`을 복사해 `.env.local`을 만들고 Supabase 키를 입력합니다.

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # 시뮬레이터 전용, 클라이언트 노출 금지
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 http://localhost:3000 을 열면 대시보드를 확인할 수 있습니다.

---

## 주요 명령어

```bash
pnpm dev        # 개발 서버 시작
pnpm build      # 프로덕션 빌드
pnpm start      # 프로덕션 서버 시작
pnpm lint       # ESLint 검사
pnpm simulate   # 실시간 데이터 시뮬레이터 실행
```

---

## 실시간 데이터 시뮬레이터 (`scripts/simulate.js`)

### 개요

Supabase에 연결된 실제 DB에 로봇 상태 변화, 미션 생성/완료, 인시던트 발생/해결을 자동으로 주입하는 Node.js 스크립트입니다.
대시보드의 Realtime 구독 기능을 테스트하거나 데모 환경을 구성할 때 사용합니다.

> 시뮬레이터를 종료(`Ctrl+C`)하면 실행 중 생성된 모든 데이터가 자동으로 삭제되고, 로봇 상태가 실행 전 스냅샷으로 복원됩니다.

### 사전 요건

`.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`가 설정되어 있어야 합니다.
이 키는 RLS를 우회하여 직접 DB를 조작하므로 **절대 클라이언트 코드에 노출하지 마세요.**

```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Supabase 대시보드 → Project Settings → API Keys → Secret keys
```

### 실행

```bash
pnpm simulate
```

### 동작 방식

시뮬레이터는 시작 시 현재 DB 상태를 스냅샷으로 저장한 뒤, 아래 세 가지 인터벌로 데이터를 변경합니다.

| 인터벌   | 동작                                                             |
| -------- | ---------------------------------------------------------------- |
| **5초**  | 모든 로봇의 배터리·상태·위치 갱신                                |
| **25초** | `WORKING` 상태 로봇 중 하나에 미션 생성 (60~120초 후 자동 완료)  |
| **40초** | 40% 확률로 임의 로봇에 인시던트 발생 (30~60초 후 조사 중 → 해결) |

#### 로봇 상태 전환 규칙

```
IDLE  ──(25% 확률)──▶  WORKING  ──(배터리 < 15%)──▶  RETURNING
                                                          │
                                                   (배터리 < 3%)
                                                          │
                                                          ▼
ERROR ──(20% 확률)──▶ OFFLINE ──(15% 확률)──▶  CHARGING  ──(배터리 ≥ 95%)──▶  IDLE
```

#### 배터리 변동량 (틱당)

| 상태        | 변동          |
| ----------- | ------------- |
| `WORKING`   | −2.0 ~ −5.0%  |
| `RETURNING` | −0.5 ~ −1.5%  |
| `CHARGING`  | +6.0 ~ +12.0% |

#### WET_SCRUB 전용 — 물탱크 시뮬레이션

`WORKING` 상태일 때 틱마다 청수 −0.5~2%, 오수 +0.5~2% 변동이 적용됩니다.

#### 미션 생성 데이터

| 필드                 | 값                                        |
| -------------------- | ----------------------------------------- |
| `status`             | `IN_PROGRESS` → (60~120초 후) `COMPLETED` |
| `area_cleaned_m2`    | 150 ~ 900 m²                              |
| `coverage_pct`       | 74 ~ 96%                                  |
| `cleaning_score`     | 78 ~ 98점                                 |
| `pre_contamination`  | 50 ~ 85%                                  |
| `post_contamination` | 5 ~ 20%                                   |

#### 인시던트 템플릿

| 제목                | 심각도   | 출처     |
| ------------------- | -------- | -------- |
| 통신 지연 감지      | LOW      | NETWORK  |
| 브러시 마모 경고    | LOW      | HARDWARE |
| 이상 진동 감지      | MEDIUM   | SENSOR   |
| 충전 도크 연결 오류 | MEDIUM   | HARDWARE |
| 긴급 정지 발생      | HIGH     | SOFTWARE |
| 장애물 회피 실패    | HIGH     | SOFTWARE |
| 모터 과열 감지      | CRITICAL | HARDWARE |

### 종료 및 데이터 초기화

`Ctrl+C` (또는 `SIGTERM`)를 입력하면 자동으로 아래 순서로 초기화됩니다.

1. 진행 중인 모든 타이머 취소
2. 시뮬레이터가 생성한 미션 전체 삭제
3. 시뮬레이터가 생성한 인시던트 전체 삭제
4. 로봇 상태를 실행 전 스냅샷으로 복원

---

## 프로젝트 구조

```
krat-robot-fms/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # 대시보드 라우트 그룹 (사이드바 레이아웃 공유)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # 메인 대시보드
│   │   │   ├── robots/
│   │   │   ├── missions/
│   │   │   ├── incidents/
│   │   │   └── consumables/
│   │   ├── globals.css           # 전역 스타일 + KRAT 다크 테마 토큰
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/            # 대시보드 전용 컴포넌트
│   │   ├── layout/               # Sidebar 등 레이아웃 컴포넌트
│   │   └── ui/                   # shadcn/ui 기본 + 커스텀 컴포넌트
│   └── lib/
│       ├── supabase/             # Supabase 클라이언트 (client / server)
│       ├── mock-data.ts          # 목업 데이터
│       └── utils.ts
├── scripts/
│   └── simulate.js               # 실시간 데이터 시뮬레이터
├── docs/
│   ├── dashboard_example.html    # UI 레퍼런스
│   ├── db_schema.sql             # DB 스키마
│   └── KRAT_FMS_Developer_Brief_v2.2.docx
└── CLAUDE.md                     # Claude Code 프로젝트 가이드
```

---

## 도메인 모델

```
complexes (단지)
  └── zones (구역)
        ├── robots (로봇)
        │     ├── telemetry      — 실시간 센서 데이터 (월별 파티션)
        │     ├── missions       — 청소 미션 기록
        │     ├── incidents      — 장애/이벤트
        │     └── consumables    — 소모품 현황
        └── interaction_events   — 주민-로봇 조우 이벤트
```

### 로봇 분류

| category       | subtype                    | 설명                     |
| -------------- | -------------------------- | ------------------------ |
| `CLEANING`     | `WET_SCRUB` / `DRY_VACUUM` | 미화 로봇 (라이온스봇)   |
| `AIR_PURIFIER` | `NAMUX`                    | 공기청정 로봇 (나무엑스) |
| `SECURITY`     | `LYNX_M20`                 | 보안 로봇                |
