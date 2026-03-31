"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { KpiData } from "@/lib/supabase/queries";
import type { Robot, Complex, Mission, Incident, Consumable } from "@/lib/mock-data";
import {
  fetchKpiDataClient,
  fetchRobotsClient,
  fetchComplexesClient,
  fetchRecentMissionsClient,
  fetchOpenIncidentsClient,
  fetchAlertConsumablesClient,
} from "@/lib/supabase/client-queries";

export type DashboardData = {
  kpiData: KpiData;
  robots: Robot[];
  complexes: Complex[];
  missions: Mission[];
  incidents: Incident[];
  consumables: Consumable[];
};

export function useDashboardRealtime(initialData: DashboardData): DashboardData {
  const [data, setData] = useState<DashboardData>(initialData);

  useEffect(() => {
    const supabase = createClient();

    // robots 변경 → robots + complexes + consumables + kpi 갱신
    const robotsChannel = supabase
      .channel("dashboard-robots")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "robots" },
        async () => {
          const [robots, complexes, consumables, kpiData] = await Promise.all([
            fetchRobotsClient(),
            fetchComplexesClient(),
            fetchAlertConsumablesClient(),
            fetchKpiDataClient(),
          ]);
          setData((prev) => ({ ...prev, robots, complexes, consumables, kpiData }));
        },
      )
      .subscribe();

    // missions 변경 → missions + kpi 갱신
    const missionsChannel = supabase
      .channel("dashboard-missions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "missions" },
        async () => {
          const [missions, kpiData] = await Promise.all([
            fetchRecentMissionsClient(),
            fetchKpiDataClient(),
          ]);
          setData((prev) => ({ ...prev, missions, kpiData }));
        },
      )
      .subscribe();

    // incidents 변경 → incidents + kpi 갱신
    const incidentsChannel = supabase
      .channel("dashboard-incidents")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        async () => {
          const [incidents, kpiData] = await Promise.all([
            fetchOpenIncidentsClient(),
            fetchKpiDataClient(),
          ]);
          setData((prev) => ({ ...prev, incidents, kpiData }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(robotsChannel);
      supabase.removeChannel(missionsChannel);
      supabase.removeChannel(incidentsChannel);
    };
  }, []);

  return data;
}
