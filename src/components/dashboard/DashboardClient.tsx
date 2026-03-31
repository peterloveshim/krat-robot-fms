"use client";

import type { JSX } from "react";
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
