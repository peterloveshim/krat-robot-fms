"use client";

import type { JSX } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { KpiRow } from "./KpiRow";
import { RobotGrid } from "./RobotGrid";
import { ComplexGrid } from "./ComplexGrid";
import { MissionsTable } from "./MissionsTable";
import { IncidentList } from "./IncidentList";
import { ConsumableGrid } from "./ConsumableGrid";
import { Phase2Banner } from "./Phase2Banner";
import { useDashboardRealtime } from "@/hooks/useDashboardRealtime";

export function DashboardClient(): JSX.Element {
  const data = useDashboardRealtime();

  if (data.fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full bg-krat-red-bg flex items-center justify-center">
          <AlertTriangle className="text-krat-red" size={24} />
        </div>
        <div className="text-center">
          <p className="text-foreground font-semibold mb-1">서비스 연결 오류</p>
          <p className="text-muted-foreground text-sm">{data.fetchError}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-krat-bg3 border border-krat-border text-sm text-krat-tx2 hover:text-krat-tx transition-colors"
        >
          <RefreshCw size={14} />
          새로고침
        </button>
      </div>
    );
  }

  return (
    <>
      <KpiRow data={data.kpiData} />
      <RobotGrid robots={data.robots} />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8 items-stretch">
        <div className="xl:col-span-3 flex flex-col">
          <MissionsTable missions={data.missions} />
        </div>
        <div className="xl:col-span-2 flex flex-col">
          <IncidentList incidents={data.incidents} />
        </div>
      </div>
      <div className="mb-8">
        <ComplexGrid complexes={data.complexes} />
      </div>
      <div className="mb-8">
        <ConsumableGrid consumables={data.consumables} />
      </div>
      <Phase2Banner />
    </>
  );
}
