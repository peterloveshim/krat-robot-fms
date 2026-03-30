import type { JSX } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { RobotCard } from "./RobotCard";
import type { Robot } from "@/lib/mock-data";

type RobotGridProps = { robots: Robot[] };

export function RobotGrid({ robots }: RobotGridProps): JSX.Element {
  return (
    <section className="mb-8">
      <SectionHeader title="로봇 현황" action="전체 보기" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {robots.map((robot) => (
          <RobotCard key={robot.id} robot={robot} />
        ))}
      </div>
    </section>
  );
}
