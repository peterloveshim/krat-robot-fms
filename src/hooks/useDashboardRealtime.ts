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
  isLoading: boolean;
  fetchError: string | null;
};

const initialEmpty: DashboardData = {
  kpiData: {
    totalRobots: 0,
    operatingRobots: 0,
    todayMissions: 0,
    todayAreaM2: 0,
    openIncidents: 0,
  },
  robots: [],
  complexes: [],
  missions: [],
  incidents: [],
  consumables: [],
  isLoading: true,
  fetchError: null,
};

export function useDashboardRealtime(): DashboardData {
  const [data, setData] = useState<DashboardData>(initialEmpty);

  useEffect(() => {
    const supabase = createClient();

    // 초기 데이터 fetch
    Promise.all([
      fetchRobotsClient(),
      fetchComplexesClient(),
      fetchAlertConsumablesClient(),
      fetchKpiDataClient(),
      fetchRecentMissionsClient(),
      fetchOpenIncidentsClient(),
    ])
      .then(([robots, complexes, consumables, kpiData, missions, incidents]) => {
        setData({ robots, complexes, consumables, kpiData, missions, incidents, isLoading: false, fetchError: null });
      })
      .catch((err: unknown) => {
        console.error("[Dashboard] 데이터 fetch 실패:", err);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          fetchError: "서비스에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.",
        }));
      });

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
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("[Realtime] robots channel error:", err);
          supabase.removeChannel(robotsChannel);
        }
      });

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
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("[Realtime] missions channel error:", err);
          supabase.removeChannel(missionsChannel);
        }
      });

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
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("[Realtime] incidents channel error:", err);
          supabase.removeChannel(incidentsChannel);
        }
      });

    return () => {
      supabase.removeChannel(robotsChannel);
      supabase.removeChannel(missionsChannel);
      supabase.removeChannel(incidentsChannel);
    };
  }, []);

  return data;
}
