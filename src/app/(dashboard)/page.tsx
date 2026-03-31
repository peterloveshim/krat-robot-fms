import type { JSX } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default function DashboardPage(): JSX.Element {
  return (
    <>
      <PageHeader />
      <DashboardClient />
    </>
  );
}
