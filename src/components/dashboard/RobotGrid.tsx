import { SectionHeader } from "@/components/ui/section-header";
import { RobotCard } from "./RobotCard";
import { robots } from "@/lib/mock-data";

export function RobotGrid() {
  return (
    <section className="mb-7">
      <SectionHeader title="로봇 현황" action="전체 보기 →" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {robots.map((robot) => (
          <RobotCard key={robot.id} robot={robot} />
        ))}
      </div>
    </section>
  );
}
