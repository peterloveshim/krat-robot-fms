#!/usr/bin/env node
/**
 * KRAT FMS 실시간 데이터 시뮬레이터
 *
 * 실행: pnpm simulate
 * 종료: Ctrl+C  →  모든 데이터 자동 초기화
 *
 * 필요 환경변수 (.env.local):
 *   SUPABASE_SERVICE_ROLE_KEY=<Supabase 대시보드 > Settings > API > service_role>
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// ─── 터미널 색상 ───────────────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

function ts() {
  return `${C.gray}[${new Date().toLocaleTimeString("ko-KR")}]${C.reset}`;
}
const log = {
  info: (msg) => console.log(`${ts()} ${C.cyan}ℹ${C.reset}  ${msg}`),
  ok: (msg) => console.log(`${ts()} ${C.green}✓${C.reset}  ${msg}`),
  warn: (msg) => console.log(`${ts()} ${C.yellow}⚡${C.reset}  ${msg}`),
  err: (msg) => console.log(`${ts()} ${C.red}✗${C.reset}  ${msg}`),
  mission: (msg) => console.log(`${ts()} ${C.blue}📋${C.reset} ${msg}`),
  incident: (msg) => console.log(`${ts()} ${C.red}🚨${C.reset} ${msg}`),
  robot: (msg) => console.log(`${ts()} ${C.magenta}🤖${C.reset} ${msg}`),
};

// ─── .env.local 파싱 ──────────────────────────────────────────────
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

// ─── 환경변수 검증 ────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    `\n${C.red}${C.bold}오류: SUPABASE_SERVICE_ROLE_KEY가 없습니다.${C.reset}`,
  );
  console.error(
    `\n  1. Supabase 대시보드 → Settings → API → service_role 키 복사`,
  );
  console.error(`  2. .env.local 에 아래 줄 추가:\n`);
  console.error(
    `     ${C.yellow}SUPABASE_SERVICE_ROLE_KEY=eyJ...${C.reset}\n`,
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── 유틸 ────────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randF = (min, max, d = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(d));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// ─── 상태 ─────────────────────────────────────────────────────────
let initialRobots = []; // 복원용 스냅샷
let accessibleZones = []; // robot_accessible = true 구역들
let zonesByComplex = {}; // complexId → zones[]

// 생성된 레코드 추적 (종료 시 삭제)
const createdMissionIds = [];
const createdIncidentIds = [];

// 진행 중인 타이머
const pendingMissionTimers = new Map();
const pendingIncidentTimers = new Map();

let isShuttingDown = false;

// ─── 초기화 ──────────────────────────────────────────────────────
async function initialize() {
  log.info("초기 데이터 로드 중...");

  // 로봇 스냅샷
  const { data: robots, error: re } = await supabase
    .from("robots")
    .select("*")
    .order("serial_number");
  if (re) throw re;
  initialRobots = robots;

  // 접근 가능 구역 (올림픽파크포레온 기준)
  const { data: zones, error: ze } = await supabase
    .from("zones")
    .select("id, name, complex_id")
    .eq("robot_accessible", true);
  if (ze) throw ze;
  accessibleZones = zones;

  // complexId → zones 맵
  for (const z of zones) {
    if (!zonesByComplex[z.complex_id]) zonesByComplex[z.complex_id] = [];
    zonesByComplex[z.complex_id].push(z);
  }

  console.log();
  console.log(`${C.bold}${C.cyan}  KRAT FMS 실시간 시뮬레이터${C.reset}`);
  console.log(`  ${"─".repeat(44)}`);
  log.ok(`로봇 ${robots.length}대 스냅샷 저장`);
  log.ok(`접근 가능 구역 ${zones.length}개 로드`);
  log.info(`대시보드: ${C.cyan}http://localhost:3000${C.reset}`);
  log.info(`종료 시 Ctrl+C → 모든 데이터 자동 초기화`);
  console.log();
}

// ─── 로봇 상태/배터리 틱 ─────────────────────────────────────────
async function tickRobots() {
  if (isShuttingDown) return;

  const { data: robots, error } = await supabase
    .from("robots")
    .select(
      "id, serial_number, display_name, status, battery_pct, current_zone_id, complex_id, subtype",
    );
  if (error || !robots) return;

  const BATCH = [];

  for (const robot of robots) {
    let battery = robot.battery_pct ?? 50;
    let status = robot.status;
    let zoneId = robot.current_zone_id;

    // 배터리 변동
    if (status === "WORKING") battery = clamp(battery - randF(2, 5, 1), 0, 100);
    else if (status === "CHARGING")
      battery = clamp(battery + randF(6, 12, 1), 0, 100);
    else if (status === "RETURNING")
      battery = clamp(battery - randF(0.5, 1.5, 1), 0, 100);

    // 상태 전환
    if (status === "WORKING" && battery < 15) {
      status = "RETURNING";
      log.robot(
        `${robot.display_name} 배터리 부족 (${battery.toFixed(0)}%) → 복귀 중`,
      );
    } else if (status === "RETURNING") {
      if (battery < 3) {
        status = "CHARGING";
        zoneId = null;
        log.warn(`${robot.display_name} 도킹 → 충전 시작`);
      }
    } else if (status === "CHARGING" && battery >= 95) {
      status = "IDLE";
      log.ok(`${robot.display_name} 충전 완료 → 대기`);
    } else if (status === "IDLE" && Math.random() < 0.25) {
      // 25% 확률로 작업 시작
      const zones =
        zonesByComplex[robot.complex_id] || accessibleZones;
      if (zones.length > 0) {
        const zone = pick(zones);
        status = "WORKING";
        zoneId = zone.id;
        battery = clamp(battery, 20, 100); // 최소 20%로 시작
        log.robot(`${robot.display_name} 작업 시작 → ${zone.name}`);
      }
    } else if (status === "OFFLINE" && Math.random() < 0.15) {
      status = "CHARGING";
      battery = rand(10, 30);
      log.warn(`${robot.display_name} 재기동 → 충전 시작`);
    } else if (status === "ERROR" && Math.random() < 0.2) {
      status = "OFFLINE";
      log.err(`${robot.display_name} ERROR → OFFLINE 전환`);
    }

    // WET_SCRUB: 물탱크 시뮬레이션
    let cleanWater = robot.clean_water_pct;
    let dirtyWater = robot.dirty_water_pct;
    if (robot.subtype === "WET_SCRUB" && status === "WORKING") {
      cleanWater = clamp((cleanWater ?? 80) - randF(0.5, 2, 1), 0, 100);
      dirtyWater = clamp((dirtyWater ?? 20) + randF(0.5, 2, 1), 0, 100);
    }

    BATCH.push({
      id: robot.id,
      status,
      battery_pct: parseFloat(battery.toFixed(1)),
      current_zone_id: zoneId,
      last_seen_at: new Date().toISOString(),
      ...(robot.subtype === "WET_SCRUB" && {
        clean_water_pct: typeof cleanWater === "number" ? parseFloat(cleanWater.toFixed(1)) : null,
        dirty_water_pct: typeof dirtyWater === "number" ? parseFloat(dirtyWater.toFixed(1)) : null,
      }),
    });
  }

  // 순차 업데이트 (배치 API 미지원)
  await Promise.all(
    BATCH.map(({ id, ...fields }) =>
      supabase.from("robots").update(fields).eq("id", id),
    ),
  );
}

// ─── 미션 생성 ───────────────────────────────────────────────────
async function tryCreateMission() {
  if (isShuttingDown) return;

  // WORKING 상태이고 zone이 배정된 로봇 중 랜덤 선택
  const { data: robots } = await supabase
    .from("robots")
    .select("id, display_name, current_zone_id, complex_id")
    .eq("status", "WORKING")
    .not("current_zone_id", "is", null);

  if (!robots || robots.length === 0) return;

  const robot = pick(robots);
  const zone =
    accessibleZones.find((z) => z.id === robot.current_zone_id) ||
    pick(accessibleZones);
  if (!zone) return;

  const now = new Date();
  const { data: mission, error } = await supabase
    .from("missions")
    .insert({
      robot_id: robot.id,
      zone_id: zone.id,
      complex_id: robot.complex_id || zone.complex_id,
      mission_name: `${robot.display_name} 자동청소 ${now.getHours()}시`,
      status: "IN_PROGRESS",
      started_at: now.toISOString(),
      scheduled_at: now.toISOString(),
      pre_contamination: randF(50, 85, 1),
    })
    .select("id")
    .single();

  if (error || !mission) return;

  createdMissionIds.push(mission.id);
  log.mission(
    `미션 생성: ${C.bold}${robot.display_name}${C.reset} → ${zone.name}`,
  );

  // 60~120초 후 완료
  const duration = rand(60, 120);
  const t = setTimeout(async () => {
    if (isShuttingDown) return;
    const area = randF(150, 900, 1);
    const coverage = randF(74, 96, 1);
    await supabase
      .from("missions")
      .update({
        status: "COMPLETED",
        completed_at: new Date().toISOString(),
        duration_minutes: parseFloat((duration / 60).toFixed(2)),
        area_cleaned_m2: area,
        coverage_pct: coverage,
        cleaning_score: randF(78, 98, 1),
        water_used_liters: randF(5, 22, 1),
        post_contamination: randF(5, 20, 1),
      })
      .eq("id", mission.id);
    log.mission(
      `미션 완료: ${robot.display_name} (${area}m², 커버리지 ${coverage}%)`,
    );
    pendingMissionTimers.delete(mission.id);
  }, duration * 1000);

  pendingMissionTimers.set(mission.id, t);
}

// ─── 인시던트 발생 ────────────────────────────────────────────────
async function tryCreateIncident() {
  if (isShuttingDown || Math.random() > 0.4) return;

  const { data: robots } = await supabase
    .from("robots")
    .select("id, display_name, current_zone_id, complex_id");
  if (!robots || robots.length === 0) return;

  const robot = pick(robots);
  const zone = robot.current_zone_id
    ? accessibleZones.find((z) => z.id === robot.current_zone_id)
    : null;

  const TEMPLATES = [
    { title: "통신 지연 감지", severity: "LOW", source: "NETWORK" },
    { title: "브러시 마모 경고", severity: "LOW", source: "HARDWARE" },
    { title: "이상 진동 감지", severity: "MEDIUM", source: "SENSOR" },
    { title: "충전 도크 연결 오류", severity: "MEDIUM", source: "HARDWARE" },
    { title: "긴급 정지 발생", severity: "HIGH", source: "SOFTWARE" },
    { title: "장애물 회피 실패", severity: "HIGH", source: "SOFTWARE" },
    { title: "모터 과열 감지", severity: "CRITICAL", source: "HARDWARE" },
  ];
  const tpl = pick(TEMPLATES);

  const { data: incident, error } = await supabase
    .from("incidents")
    .insert({
      robot_id: robot.id,
      zone_id: zone?.id || null,
      complex_id: robot.complex_id,
      severity: tpl.severity,
      status: "OPEN",
      title: `${robot.display_name} — ${tpl.title}`,
      error_source: tpl.source,
      occurred_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !incident) return;

  createdIncidentIds.push(incident.id);
  log.incident(
    `[${tpl.severity}] ${robot.display_name} — ${tpl.title}`,
  );

  // 30~60s → INVESTIGATING
  const t1 = rand(30, 60) * 1000;
  // t1 + 30~90s → RESOLVED
  const t2 = t1 + rand(30, 90) * 1000;

  setTimeout(async () => {
    if (isShuttingDown) return;
    await supabase
      .from("incidents")
      .update({ status: "INVESTIGATING" })
      .eq("id", incident.id);
    log.warn(`인시던트 조사 중: ${robot.display_name} — ${tpl.title}`);
  }, t1);

  const resolveTimer = setTimeout(async () => {
    if (isShuttingDown) return;
    await supabase
      .from("incidents")
      .update({
        status: "RESOLVED",
        resolved_at: new Date().toISOString(),
        resolution: "원격 진단 완료 — 자동 복구",
      })
      .eq("id", incident.id);
    log.ok(`인시던트 해결: ${robot.display_name} — ${tpl.title}`);
    pendingIncidentTimers.delete(incident.id);
  }, t2);

  pendingIncidentTimers.set(incident.id, resolveTimer);
}

// ─── 데이터 초기화 ─────────────────────────────────────────────────
async function resetData() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log();
  log.warn("종료 감지 — 데이터 초기화 중...");

  // 진행 중인 타이머 모두 취소
  for (const t of pendingMissionTimers.values()) clearTimeout(t);
  for (const t of pendingIncidentTimers.values()) clearTimeout(t);

  // 생성된 미션 삭제
  if (createdMissionIds.length > 0) {
    const { error } = await supabase
      .from("missions")
      .delete()
      .in("id", createdMissionIds);
    if (!error)
      log.ok(`미션 ${createdMissionIds.length}건 삭제`);
    else log.err(`미션 삭제 실패: ${error.message}`);
  }

  // 생성된 인시던트 삭제
  if (createdIncidentIds.length > 0) {
    const { error } = await supabase
      .from("incidents")
      .delete()
      .in("id", createdIncidentIds);
    if (!error)
      log.ok(`인시던트 ${createdIncidentIds.length}건 삭제`);
    else log.err(`인시던트 삭제 실패: ${error.message}`);
  }

  // 로봇 초기 상태 복원
  await Promise.all(
    initialRobots.map((r) =>
      supabase
        .from("robots")
        .update({
          status: r.status,
          battery_pct: r.battery_pct,
          current_zone_id: r.current_zone_id,
          latitude: r.latitude,
          longitude: r.longitude,
          last_seen_at: r.last_seen_at,
          clean_water_pct: r.clean_water_pct,
          dirty_water_pct: r.dirty_water_pct,
          total_missions: r.total_missions,
          total_area_m2: r.total_area_m2,
          total_hours: r.total_hours,
          updated_at: new Date().toISOString(),
        })
        .eq("id", r.id),
    ),
  );
  log.ok(`로봇 ${initialRobots.length}대 초기 상태 복원 완료`);

  console.log();
  log.ok(`${C.bold}초기화 완료 — 안녕히 가세요!${C.reset}`);
  console.log();
}

// ─── 메인 ─────────────────────────────────────────────────────────
async function main() {
  await initialize();

  // 첫 틱 즉시 실행
  await tickRobots();

  // 인터벌 등록
  //  ├── 5s: 로봇 상태/배터리 갱신
  //  ├── 25s: 미션 생성 시도
  //  └── 40s: 인시던트 발생 시도
  const t1 = setInterval(tickRobots, 5_000);
  const t2 = setInterval(tryCreateMission, 25_000);
  const t3 = setInterval(tryCreateIncident, 40_000);

  log.ok(`${C.bold}시뮬레이션 시작${C.reset} (로봇 틱 5s / 미션 25s / 인시던트 40s)`);
  console.log();

  // 종료 핸들러
  async function shutdown() {
    clearInterval(t1);
    clearInterval(t2);
    clearInterval(t3);
    await resetData();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(`\n${C.red}치명적 오류:${C.reset}`, err);
  process.exit(1);
});
