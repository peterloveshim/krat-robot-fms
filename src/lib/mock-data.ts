// KRAT FMS 목업 데이터 (UI 개발 전용 — Supabase 연동 전)

export type RobotCategory = "CLEANING" | "AIR_PURIFIER" | "SECURITY";
export type RobotSubtype = "WET_SCRUB" | "DRY_VACUUM" | "NAMUX" | "LYNX_M20";
export type RobotStatus =
  | "ONLINE"
  | "OFFLINE"
  | "CHARGING"
  | "WORKING"
  | "ERROR"
  | "MANUAL"
  | "RETURNING"
  | "IDLE"
  | "MAINTENANCE";

export type MissionStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "PAUSED";

export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";

export type Robot = {
  id: string;
  serialNumber: string;
  displayName: string;
  category: RobotCategory;
  subtype: RobotSubtype;
  manufacturer: string;
  model: string;
  status: RobotStatus;
  batteryPct: number;
  complexId: string;
  complexName: string;
  zoneName: string;
  cleanWaterPct?: number;
  dirtyWaterPct?: number;
  coveragePct?: number;
  firmwareVersion: string;
};

export type Complex = {
  id: string;
  name: string;
  district: string;
  robots: { operating: number; charging: number; error: number };
  subtypeLabel: string;
};

export type Mission = {
  id: string;
  robotName: string;
  complexName: string;
  zoneName: string;
  startedAt: string;
  areaCleaned: number;
  coveragePct: number;
  status: MissionStatus;
};

export type Incident = {
  id: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  complexName: string;
  zoneName: string;
  occurredAt: string;
};

export type Consumable = {
  id: string;
  name: string;
  remainingPct: number;
  robotName: string;
  alertMessage: string;
};

// ============================================================
// KPI
// ============================================================

export const kpiData = {
  totalRobots: 15,
  operatingRobots: 12,
  todayMissions: 34,
  todayAreaM2: 4280,
  openIncidents: 3,
};

// ============================================================
// 로봇 목록 (15대)
// ============================================================

export const robots: Robot[] = [
  {
    id: "1",
    serialNumber: "CLB-W-001",
    displayName: "포레온-W01",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "WORKING",
    batteryPct: 78,
    complexId: "1",
    complexName: "올림픽파크포레온",
    zoneName: "B1 주차장 A구역",
    cleanWaterPct: 62,
    dirtyWaterPct: 38,
    coveragePct: 52,
    firmwareVersion: "v3.2.1",
  },
  {
    id: "2",
    serialNumber: "CLB-W-002",
    displayName: "포레온-W02",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "CHARGING",
    batteryPct: 45,
    complexId: "1",
    complexName: "올림픽파크포레온",
    zoneName: "충전 도크 B1",
    cleanWaterPct: 80,
    dirtyWaterPct: 20,
    firmwareVersion: "v3.2.1",
  },
  {
    id: "3",
    serialNumber: "CLB-W-003",
    displayName: "포레온-W03",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "WORKING",
    batteryPct: 91,
    complexId: "1",
    complexName: "올림픽파크포레온",
    zoneName: "B1 주차장 B구역",
    cleanWaterPct: 55,
    dirtyWaterPct: 45,
    coveragePct: 68,
    firmwareVersion: "v3.2.1",
  },
  {
    id: "4",
    serialNumber: "CLB-W-004",
    displayName: "포레온-W04",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "IDLE",
    batteryPct: 100,
    complexId: "1",
    complexName: "올림픽파크포레온",
    zoneName: "101동 로비",
    cleanWaterPct: 100,
    dirtyWaterPct: 0,
    firmwareVersion: "v3.2.1",
  },
  {
    id: "5",
    serialNumber: "CLB-W-005",
    displayName: "개포-W01",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "WORKING",
    batteryPct: 63,
    complexId: "2",
    complexName: "개포자이프레지던스",
    zoneName: "B2 주차장",
    cleanWaterPct: 40,
    dirtyWaterPct: 60,
    coveragePct: 71,
    firmwareVersion: "v3.2.0",
  },
  {
    id: "6",
    serialNumber: "CLB-D-006",
    displayName: "개포-D01",
    category: "CLEANING",
    subtype: "DRY_VACUUM",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "IDLE",
    batteryPct: 88,
    complexId: "2",
    complexName: "개포자이프레지던스",
    zoneName: "커뮤니티센터 1층",
    firmwareVersion: "v3.2.0",
  },
  {
    id: "7",
    serialNumber: "CLB-W-007",
    displayName: "TheH-W01",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "WORKING",
    batteryPct: 72,
    complexId: "3",
    complexName: "The H 퍼스티어 아이파크",
    zoneName: "B1 주차장",
    cleanWaterPct: 48,
    dirtyWaterPct: 52,
    coveragePct: 83,
    firmwareVersion: "v3.2.1",
  },
  {
    id: "8",
    serialNumber: "CLB-W-008",
    displayName: "TheH-W02",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "WORKING",
    batteryPct: 55,
    complexId: "3",
    complexName: "The H 퍼스티어 아이파크",
    zoneName: "B2 주차장",
    cleanWaterPct: 35,
    dirtyWaterPct: 65,
    coveragePct: 61,
    firmwareVersion: "v3.2.1",
  },
  {
    id: "9",
    serialNumber: "CLB-D-009",
    displayName: "TheH-D01",
    category: "CLEANING",
    subtype: "DRY_VACUUM",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "ERROR",
    batteryPct: 34,
    complexId: "3",
    complexName: "The H 퍼스티어 아이파크",
    zoneName: "커뮤니티센터",
    firmwareVersion: "v3.2.0",
  },
  {
    id: "10",
    serialNumber: "CLB-D-010",
    displayName: "TheH-D02",
    category: "CLEANING",
    subtype: "DRY_VACUUM",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "CHARGING",
    batteryPct: 22,
    complexId: "3",
    complexName: "The H 퍼스티어 아이파크",
    zoneName: "충전 도크",
    firmwareVersion: "v3.2.0",
  },
  {
    id: "11",
    serialNumber: "CLB-W-011",
    displayName: "타팰3-W01",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "WORKING",
    batteryPct: 84,
    complexId: "4",
    complexName: "타워팰리스 3차",
    zoneName: "B1 주차장",
    cleanWaterPct: 58,
    dirtyWaterPct: 42,
    coveragePct: 77,
    firmwareVersion: "v3.2.1",
  },
  {
    id: "12",
    serialNumber: "CLB-W-012",
    displayName: "아너힐즈-W01",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "IDLE",
    batteryPct: 97,
    complexId: "5",
    complexName: "디에이치 아너힐즈",
    zoneName: "로비",
    cleanWaterPct: 100,
    dirtyWaterPct: 0,
    firmwareVersion: "v3.2.1",
  },
  {
    id: "13",
    serialNumber: "CLB-W-013",
    displayName: "퍼스티지-W01",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "WORKING",
    batteryPct: 69,
    complexId: "6",
    complexName: "래미안 퍼스티지",
    zoneName: "B2 주차장",
    cleanWaterPct: 44,
    dirtyWaterPct: 56,
    coveragePct: 59,
    firmwareVersion: "v3.1.9",
  },
  {
    id: "14",
    serialNumber: "CLB-D-014",
    displayName: "갤러리아-D01",
    category: "CLEANING",
    subtype: "DRY_VACUUM",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "OFFLINE",
    batteryPct: 0,
    complexId: "7",
    complexName: "갤러리아포레",
    zoneName: "-",
    firmwareVersion: "v3.1.8",
  },
  {
    id: "15",
    serialNumber: "CLB-W-015",
    displayName: "트리마제-W01",
    category: "CLEANING",
    subtype: "WET_SCRUB",
    manufacturer: "클로봇",
    model: "LionsBot R3 Scrub Pro",
    status: "WORKING",
    batteryPct: 76,
    complexId: "8",
    complexName: "트리마제",
    zoneName: "B1 주차장",
    cleanWaterPct: 50,
    dirtyWaterPct: 50,
    coveragePct: 44,
    firmwareVersion: "v3.2.0",
  },
];

// ============================================================
// 단지별 요약 (4개 표시)
// ============================================================

export const complexes: Complex[] = [
  {
    id: "1",
    name: "올림픽파크포레온",
    district: "강동구",
    subtypeLabel: "습식 4대",
    robots: { operating: 2, charging: 1, error: 0 },
  },
  {
    id: "2",
    name: "개포자이프레지던스",
    district: "강남구",
    subtypeLabel: "습식1 + 건식1",
    robots: { operating: 1, charging: 0, error: 0 },
  },
  {
    id: "3",
    name: "The H 퍼스티어 아이파크",
    district: "강남구",
    subtypeLabel: "습식2 + 건식2",
    robots: { operating: 2, charging: 1, error: 1 },
  },
  {
    id: "4",
    name: "타워팰리스 3차",
    district: "강남구",
    subtypeLabel: "습식 1대",
    robots: { operating: 1, charging: 0, error: 0 },
  },
];

// ============================================================
// 최근 미션 (5개)
// ============================================================

export const missions: Mission[] = [
  {
    id: "1",
    robotName: "포레온-W01",
    complexName: "올림픽파크포레온",
    zoneName: "B1 주차장 A구역",
    startedAt: "14:10",
    areaCleaned: 142,
    coveragePct: 94,
    status: "IN_PROGRESS",
  },
  {
    id: "2",
    robotName: "TheH-W01",
    complexName: "The H 퍼스티어 아이파크",
    zoneName: "B1 주차장",
    startedAt: "13:45",
    areaCleaned: 310,
    coveragePct: 87,
    status: "IN_PROGRESS",
  },
  {
    id: "3",
    robotName: "개포-W01",
    complexName: "개포자이프레지던스",
    zoneName: "B2 주차장",
    startedAt: "13:20",
    areaCleaned: 280,
    coveragePct: 72,
    status: "IN_PROGRESS",
  },
  {
    id: "4",
    robotName: "타팰3-W01",
    complexName: "타워팰리스 3차",
    zoneName: "B1 주차장",
    startedAt: "12:50",
    areaCleaned: 520,
    coveragePct: 96,
    status: "COMPLETED",
  },
  {
    id: "5",
    robotName: "TheH-D01",
    complexName: "The H 퍼스티어 아이파크",
    zoneName: "커뮤니티센터",
    startedAt: "12:30",
    areaCleaned: 45,
    coveragePct: 38,
    status: "FAILED",
  },
];

// ============================================================
// 인시던트 (3개)
// ============================================================

export const incidents: Incident[] = [
  {
    id: "1",
    severity: "HIGH",
    status: "OPEN",
    title: "TheH-D01 미션 중 정지 — 장애물 감지 반복",
    complexName: "The H 퍼스티어 아이파크",
    zoneName: "커뮤니티센터",
    occurredAt: "14:05",
  },
  {
    id: "2",
    severity: "MEDIUM",
    status: "OPEN",
    title: "포레온-W02 충전 도크 인식 지연",
    complexName: "올림픽파크포레온",
    zoneName: "충전 도크 B1",
    occurredAt: "13:41",
  },
  {
    id: "3",
    severity: "LOW",
    status: "OPEN",
    title: "개포-D01 소음 민원 접수",
    complexName: "개포자이프레지던스",
    zoneName: "커뮤니티센터 1층",
    occurredAt: "12:15",
  },
];

// ============================================================
// 소모품 (3개 — 교체 임박)
// ============================================================

export const consumables: Consumable[] = [
  {
    id: "1",
    name: "메인 브러시",
    remainingPct: 12,
    robotName: "TheH-D01",
    alertMessage: "교체 임박",
  },
  {
    id: "2",
    name: "스퀴지 블레이드",
    remainingPct: 18,
    robotName: "포레온-W03",
    alertMessage: "교체 예정",
  },
  {
    id: "3",
    name: "사이드 브러시",
    remainingPct: 24,
    robotName: "개포-W01",
    alertMessage: "교체 예정",
  },
];
