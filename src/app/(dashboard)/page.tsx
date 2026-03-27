import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { RobotGrid } from "@/components/dashboard/RobotGrid";
import { ComplexGrid } from "@/components/dashboard/ComplexGrid";
import { MissionsTable } from "@/components/dashboard/MissionsTable";
import { IncidentList } from "@/components/dashboard/IncidentList";
import { ConsumableGrid } from "@/components/dashboard/ConsumableGrid";
import { Phase2Banner } from "@/components/dashboard/Phase2Banner";

export default function DashboardPage() {
  return (
    <>
      <PageHeader />
      <KpiRow />
      <RobotGrid />
      <ComplexGrid />
      <MissionsTable />
      <IncidentList />
      <ConsumableGrid />
      <Phase2Banner />
    </>
  );
}
