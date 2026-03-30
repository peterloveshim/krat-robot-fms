import type { JSX } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ComplexCard } from "./ComplexCard";
import type { Complex } from "@/lib/mock-data";

type ComplexGridProps = { complexes: Complex[] };

export function ComplexGrid({ complexes }: ComplexGridProps): JSX.Element {
  return (
    <section>
      <SectionHeader title="단지별 요약" action="전체 보기" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {complexes.map((complex) => (
          <ComplexCard key={complex.id} complex={complex} />
        ))}
      </div>
    </section>
  );
}
