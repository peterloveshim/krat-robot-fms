import { SectionHeader } from "@/components/ui/section-header";
import { ComplexCard } from "./ComplexCard";
import { complexes } from "@/lib/mock-data";

export function ComplexGrid() {
  return (
    <section className="mb-7">
      <SectionHeader title="단지별 요약" action="전체 보기 →" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {complexes.map((complex) => (
          <ComplexCard key={complex.id} complex={complex} />
        ))}
      </div>
    </section>
  );
}
