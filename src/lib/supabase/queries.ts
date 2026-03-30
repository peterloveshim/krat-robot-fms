import { createClient } from "./server";
import type {
  Robot,
  Complex,
  Mission,
  Incident,
  Consumable,
} from "@/lib/mock-data";

// ──────────────────────────────────────────────────────────────────
// KPI
// ──────────────────────────────────────────────────────────────────
export type KpiData = {
  totalRobots: number;
  operatingRobots: number;
  todayMissions: number;
  todayAreaM2: number;
  openIncidents: number;
};

export async function fetchKpiData(): Promise<KpiData> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    { count: totalRobots },
    { count: operatingRobots },
    { count: todayMissions },
    { data: todayAreaData },
    { count: openIncidents },
  ] = await Promise.all([
    supabase.from("robots").select("*", { count: "exact", head: true }),
    supabase
      .from("robots")
      .select("*", { count: "exact", head: true })
      .in("status", ["WORKING", "ONLINE"]),
    supabase
      .from("missions")
      .select("*", { count: "exact", head: true })
      .gte("started_at", `${today}T00:00:00+09:00`)
      .lte("started_at", `${today}T23:59:59+09:00`),
    supabase
      .from("missions")
      .select("area_cleaned_m2")
      .eq("status", "COMPLETED")
      .gte("started_at", `${today}T00:00:00+09:00`)
      .lte("started_at", `${today}T23:59:59+09:00`),
    supabase
      .from("incidents")
      .select("*", { count: "exact", head: true })
      .eq("status", "OPEN"),
  ]);

  const todayAreaM2 =
    todayAreaData?.reduce(
      (sum, m) => sum + (m.area_cleaned_m2 ?? 0),
      0,
    ) ?? 0;

  return {
    totalRobots: totalRobots ?? 0,
    operatingRobots: operatingRobots ?? 0,
    todayMissions: todayMissions ?? 0,
    todayAreaM2: Math.round(todayAreaM2),
    openIncidents: openIncidents ?? 0,
  };
}

// ──────────────────────────────────────────────────────────────────
// Robots
// ──────────────────────────────────────────────────────────────────
export async function fetchRobots(): Promise<Robot[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("robots")
    .select(
      `
      id, serial_number, display_name, category, subtype,
      manufacturer, model, status, battery_pct,
      complex_id, current_zone_id,
      clean_water_pct, dirty_water_pct, firmware_version,
      complexes(name),
      zones!robots_current_zone_id_fkey(name)
    `,
    )
    .order("display_name");

  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    serialNumber: r.serial_number,
    displayName: r.display_name ?? r.serial_number,
    category: r.category as Robot["category"],
    subtype: r.subtype as Robot["subtype"],
    manufacturer: r.manufacturer,
    model: r.model,
    status: r.status as Robot["status"],
    batteryPct: r.battery_pct ?? 0,
    complexId: r.complex_id ?? "",
    complexName: (r.complexes as { name: string } | null)?.name ?? "-",
    zoneName:
      (r.zones as { name: string } | null)?.name ?? "도킹 중",
    cleanWaterPct: r.clean_water_pct ?? undefined,
    dirtyWaterPct: r.dirty_water_pct ?? undefined,
    firmwareVersion: r.firmware_version ?? "-",
  }));
}

// ──────────────────────────────────────────────────────────────────
// Complexes (로봇 상태 집계 포함)
// ──────────────────────────────────────────────────────────────────
export async function fetchComplexes(): Promise<Complex[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("complexes")
    .select(
      `
      id, name, district,
      robots(status, subtype)
    `,
    )
    .order("name");

  if (error) throw error;

  return (data ?? []).map((c) => {
    const robotList = (c.robots as { status: string; subtype: string }[]) ?? [];

    const operating = robotList.filter((r) =>
      ["WORKING", "ONLINE", "RETURNING", "MANUAL"].includes(r.status),
    ).length;
    const charging = robotList.filter((r) => r.status === "CHARGING").length;
    const error_count = robotList.filter((r) => r.status === "ERROR").length;

    // 대표 서브타입 레이블 (습식/건식 혼재 시 "혼합")
    const subtypes = [...new Set(robotList.map((r) => r.subtype))];
    const subtypeLabel =
      subtypes.length === 0
        ? "-"
        : subtypes.length === 1
          ? subtypes[0] === "WET_SCRUB"
            ? "습식"
            : subtypes[0] === "DRY_VACUUM"
              ? "건식"
              : subtypes[0]
          : "혼합";

    return {
      id: c.id,
      name: c.name,
      district: c.district ?? "-",
      robots: { operating, charging, error: error_count },
      subtypeLabel,
    };
  });
}

// ──────────────────────────────────────────────────────────────────
// Missions (최근 10건)
// ──────────────────────────────────────────────────────────────────
export async function fetchRecentMissions(): Promise<Mission[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("missions")
    .select(
      `
      id, status, started_at, area_cleaned_m2, coverage_pct,
      robots(display_name, serial_number),
      complexes(name),
      zones(name)
    `,
    )
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) throw error;

  return (data ?? []).map((m) => ({
    id: m.id,
    robotName:
      (m.robots as { display_name: string | null; serial_number: string } | null)
        ?.display_name ??
      (m.robots as { serial_number: string } | null)?.serial_number ??
      "-",
    complexName: (m.complexes as { name: string } | null)?.name ?? "-",
    zoneName: (m.zones as { name: string } | null)?.name ?? "-",
    startedAt: m.started_at ?? "",
    areaCleaned: m.area_cleaned_m2 ?? 0,
    coveragePct: m.coverage_pct ?? 0,
    status: m.status as Mission["status"],
  }));
}

// ──────────────────────────────────────────────────────────────────
// Incidents (미해결 인시던트, 최근 10건)
// ──────────────────────────────────────────────────────────────────
export async function fetchOpenIncidents(): Promise<Incident[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("incidents")
    .select(
      `
      id, severity, status, title, occurred_at,
      complexes(name),
      zones(name)
    `,
    )
    .in("status", ["OPEN", "INVESTIGATING"])
    .order("occurred_at", { ascending: false })
    .limit(6);

  if (error) throw error;

  return (data ?? []).map((i) => ({
    id: i.id,
    severity: i.severity as Incident["severity"],
    status: i.status as Incident["status"],
    title: i.title,
    complexName: (i.complexes as { name: string } | null)?.name ?? "-",
    zoneName: (i.zones as { name: string } | null)?.name ?? "-",
    occurredAt: i.occurred_at,
  }));
}

// ──────────────────────────────────────────────────────────────────
// Consumables (알림 활성 소모품)
// ──────────────────────────────────────────────────────────────────
export async function fetchAlertConsumables(): Promise<Consumable[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("consumables")
    .select(
      `
      id, remaining_pct, alert_threshold_pct,
      robots(display_name, serial_number),
      consumable_types(name)
    `,
    )
    .eq("is_alert_active", true)
    .order("remaining_pct")
    .limit(10);

  if (error) throw error;

  return (data ?? []).map((c) => {
    const remaining = c.remaining_pct;
    const alertMessage =
      remaining <= 10
        ? "즉시 교체 필요"
        : remaining <= 20
          ? "교체 임박"
          : "교체 예정";

    return {
      id: c.id,
      name: (c.consumable_types as { name: string } | null)?.name ?? "-",
      remainingPct: remaining,
      robotName:
        (c.robots as { display_name: string | null; serial_number: string } | null)
          ?.display_name ??
        (c.robots as { serial_number: string } | null)?.serial_number ??
        "-",
      alertMessage,
    };
  });
}
