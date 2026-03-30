import type { JSX } from "react";
import { AutoRefresh } from "@/components/dashboard/AutoRefresh";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { RobotGrid } from "@/components/dashboard/RobotGrid";
import { ComplexGrid } from "@/components/dashboard/ComplexGrid";
import { MissionsTable } from "@/components/dashboard/MissionsTable";
import { IncidentList } from "@/components/dashboard/IncidentList";
import { ConsumableGrid } from "@/components/dashboard/ConsumableGrid";
import { Phase2Banner } from "@/components/dashboard/Phase2Banner";
import {
  fetchKpiData,
  fetchRobots,
  fetchComplexes,
  fetchRecentMissions,
  fetchOpenIncidents,
  fetchAlertConsumables,
} from "@/lib/supabase/queries";

export default async function DashboardPage(): Promise<JSX.Element> {
  const [kpiData, robots, complexes, missions, incidents, consumables] =
    await Promise.all([
      fetchKpiData(),
      fetchRobots(),
      fetchComplexes(),
      fetchRecentMissions(),
      fetchOpenIncidents(),
      fetchAlertConsumables(),
    ]);

  return (
    <>
      <AutoRefresh />
      <PageHeader />

      {/* KPI 히어로 섹션 */}
      <KpiRow data={kpiData} />

      {/* 로봇 현황 — 핵심 데이터 */}
      <RobotGrid robots={robots} />

      {/* 2열 레이아웃: 미션 테이블 (넓음) + 인시던트 (좁음) — 높이 동기화 */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8 items-stretch">
        <div className="xl:col-span-3 flex flex-col">
          <MissionsTable missions={missions} />
        </div>
        <div className="xl:col-span-2 flex flex-col">
          <IncidentList incidents={incidents} />
        </div>
      </div>

      {/* 단지별 요약 — 전체 너비 */}
      <div className="mb-8">
        <ComplexGrid complexes={complexes} />
      </div>

      {/* 소모품 현황 — 전체 너비 */}
      <div className="mb-8">
        <ConsumableGrid consumables={consumables} />
      </div>

      <Phase2Banner />
    </>
  );
}
