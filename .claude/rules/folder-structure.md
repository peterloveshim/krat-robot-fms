# 프로젝트 폴더 구조

```
krat-robot-fms/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (dashboard)/              # 대시보드 라우트 그룹 (사이드바 레이아웃 공유)
│   │   │   ├── layout.tsx            # 사이드바 + main 래퍼
│   │   │   ├── page.tsx              # / — 메인 대시보드
│   │   │   ├── robots/
│   │   │   │   └── page.tsx          # /robots — 로봇 현황 (준비 중)
│   │   │   ├── missions/
│   │   │   │   └── page.tsx          # /missions — 미션 기록 (준비 중)
│   │   │   ├── incidents/
│   │   │   │   └── page.tsx          # /incidents — 인시던트 (준비 중)
│   │   │   └── consumables/
│   │   │       └── page.tsx          # /consumables — 소모품 (준비 중)
│   │   ├── globals.css               # 전역 스타일 + KRAT 다크 테마 토큰
│   │   ├── layout.tsx                # 루트 레이아웃 (폰트, 메타데이터)
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── dashboard/                # 대시보드 전용 컴포넌트
│   │   │   ├── ComplexCard.tsx       # 단지 요약 카드
│   │   │   ├── ComplexGrid.tsx       # 단지 그리드
│   │   │   ├── ConsumableGrid.tsx    # 소모품 현황 그리드
│   │   │   ├── IncidentList.tsx      # 인시던트 목록
│   │   │   ├── KpiRow.tsx            # 상단 KPI 지표 행
│   │   │   ├── MissionsTable.tsx     # 미션 테이블
│   │   │   ├── PageHeader.tsx        # 페이지 헤더 (제목 + 액션)
│   │   │   ├── Phase2Banner.tsx      # Phase 2 예정 기능 배너
│   │   │   ├── RobotCard.tsx         # 로봇 상태 카드
│   │   │   └── RobotGrid.tsx         # 로봇 그리드
│   │   ├── layout/
│   │   │   └── Sidebar.tsx           # 사이드바 (네비게이션, usePathname active 처리)
│   │   └── ui/                       # shadcn/ui 기본 + 커스텀 컴포넌트
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── progress.tsx
│   │       ├── score-badge.tsx       # 커스텀: 점수 배지
│   │       ├── section-header.tsx    # 커스텀: 섹션 헤더
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── status-badge.tsx      # 커스텀: 상태 배지 (ONLINE/OFFLINE 등)
│   │       ├── table.tsx
│   │       └── tooltip.tsx
│   │
│   └── lib/
│       ├── mock-data.ts              # 목업 데이터 (Supabase 연동 전 임시)
│       └── utils.ts                  # 공통 유틸 (cn 등)
│
├── docs/                             # 설계 문서 (참조 전용, 커밋 대상)
│   ├── dashboard_example.html        # UI 레퍼런스 — 스타일 기준
│   ├── db_schema.sql                 # DB 스키마 v4
│   └── KRAT_FMS_Developer_Brief_v2.2.docx
│
├── public/                           # 정적 파일
│   └── *.svg
│
├── CLAUDE.md                         # Claude Code 프로젝트 가이드
├── AGENTS.md
├── components.json                   # shadcn/ui 설정
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## 네이밍 컨벤션

| 대상          | 규칙       | 예시                      |
| ------------- | ---------- | ------------------------- |
| 컴포넌트 파일 | PascalCase | `RobotCard.tsx`           |
| 훅 파일       | camelCase  | `useRobotStatus.ts`       |
| 유틸/lib 파일 | camelCase  | `mock-data.ts`            |
| 라우트 폴더   | kebab-case | `robots/`, `consumables/` |
| 라우트 그룹   | (소문자)   | `(dashboard)/`            |

---

## 새 페이지 추가 규칙

`(dashboard)` 라우트 그룹 안에 생성해야 사이드바 레이아웃이 자동 적용된다.

```
src/app/(dashboard)/
  └── {페이지명}/
        └── page.tsx
```

사이드바 링크는 `src/components/layout/Sidebar.tsx`의 `NAV_GROUPS` 배열에 추가할 것.

---

## 컴포넌트 배치 기준

- **`components/dashboard/`** — 특정 도메인 데이터를 표시하는 페이지 수준 컴포넌트
- **`components/layout/`** — 레이아웃 구조 컴포넌트 (Sidebar 등)
- **`components/ui/`** — 재사용 가능한 기본 UI 컴포넌트 (shadcn/ui 포함)

> 새 기능 컴포넌트는 `components/{feature}/` 폴더를 생성하여 관리할 것.
> 예: `components/robots/`, `components/missions/`
