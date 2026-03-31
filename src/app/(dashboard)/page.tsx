import type { JSX } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
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
      <PageHeader />
      <DashboardClient
        kpiData={kpiData}
        robots={robots}
        complexes={complexes}
        missions={missions}
        incidents={incidents}
        consumables={consumables}
      />
    </>
  );
}
