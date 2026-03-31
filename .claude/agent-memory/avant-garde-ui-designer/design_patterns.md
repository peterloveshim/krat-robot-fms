---
name: KRAT FMS Dashboard Design Patterns
description: Nebula Control glassmorphism 디자인 시스템 — 색상 팔레트, glass 유틸리티 클래스, 오브 시스템, 컴포넌트 규칙
type: project
---

## Nebula Control 디자인 시스템 (2026-03-30 리디자인)

### 색상 팔레트
- **배경**: Deep space navy `#040812`
- **Primary accent**: Electric cyan `#00E5FF`
- **Secondary accent**: Hot magenta `#FF006E`
- **Success**: Emerald `#00F5A0`
- **Error**: Coral red `#FF3B5C`
- **Warning**: Amber `#FFB020`
- **Purple**: `#A855F7`
- **텍스트**: `#E4EAF5` / `#7B85A0` / `#4A5270`

### Glass 유틸리티 클래스 (globals.css)
- `.glass-card`: blur(32px) saturate(1.4) + inset shadow -- 일반 카드
- `.glass-heavy`: blur(48px) saturate(1.5) -- 사이드바
- `.glass-panel`: blur(24px) saturate(1.3) -- 테이블/패널
- `.glass-kpi`: blur(36px) saturate(1.5) + 상단 cyan/magenta/emerald 그라디언트 border
- `.glass-table-container/header/row`: 테이블 전용 glass

### Glow 클래스
- `.glow-cyan/green/red/purple/amber/magenta`: 상태별 box-shadow + inset glow

### 배경 오브 시스템
- `.orb-cyan`: 시안 네뷸라 (좌상단, 800x800)
- `.orb-violet`: 마젠타/바이올렛 (우하단, 900x900)
- `.orb-teal`: 청록 (중앙, 600x600)
- `.orb-magenta`: 마젠타 (우상단, 500x500)
- `.orb-animate`: 25초 드리프트 애니메이션

### 컴포넌트 시각 언어
- **좌측 강조 바 (3px)**: KPI 카드, 인시던트 아이템에서 심각도/카테고리 표시
- **세그먼트형 게이지**: 배터리 바는 10-세그먼트 형태
- **미니 스파크 바**: KPI 카드에 7-포인트 수직 바 차트로 트렌드 표시
- **도넛 차트 (CSS conic-gradient)**: 단지 카드에서 로봇 상태 비율 시각화
- **펄스 애니메이터**: 활성 상태 로봇에 `animate-ping` 녹색 도트
- 모든 카드: `glass-card rounded-xl` 기본
- 에러 표시: 상단 2px 그라디언트 바 (`#FF3B5C -> rgba(255,0,110,0.6) -> transparent`)
- Section header: 좌측 3px 바에 `linear-gradient(180deg, #00E5FF, #FF006E)`
- 사이드바: `glass-heavy` + 로고에 cyan->magenta 그라디언트
- 테이블: `glass-table-container` 래퍼 + `glass-table-header` + `glass-table-row`

### 레이아웃 패턴
- **KPI -> 로봇 -> (미션+인시던트 2열) -> 단지 -> 소모품 -> Phase2**
- 미션/인시던트는 `xl:grid-cols-5`에서 3:2 비율
- 단지는 `lg:grid-cols-3 xl:grid-cols-4`
- 소모품은 `sm:grid-cols-3`
- 섹션 간격은 `mb-8`

### 코드 규칙
- `import type { JSX } from "react"` 필수 (Next.js 16 + TS strict)
- Tailwind opacity: `bg-krat-accent/10` 슬래시 구문 사용 가능 (v4)
- 불투명 배경색 사용 금지 -- 반드시 glass 유틸리티 또는 `bg-white/[0.0x]` 사용

**Why:** backdrop-filter 중심 glassmorphism으로 네뷸라 오브가 glass 패널 뒤로 비치는 효과 구현. 기존 불투명 bg-krat-bg2 패턴에서 완전히 탈피.
**How to apply:** 새 컴포넌트 추가 시 반드시 glass-card 또는 glass-panel 사용. style prop에서 inline backdrop-filter도 가능.
