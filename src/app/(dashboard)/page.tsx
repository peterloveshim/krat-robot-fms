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

export default async function DashboardPage() {
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
      <PageHeader />
      <KpiRow data={kpiData} />
      <RobotGrid robots={robots} />
      <ComplexGrid complexes={complexes} />
      <MissionsTable missions={missions} />
      <IncidentList incidents={incidents} />
      <ConsumableGrid consumables={consumables} />
      <Phase2Banner />
    </>
  );
}
