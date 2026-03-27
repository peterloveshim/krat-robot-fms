import { Card, CardContent } from "@/components/ui/card";
import type { Complex } from "@/lib/mock-data";

type ComplexCardProps = {
  complex: Complex;
};

export function ComplexCard({ complex }: ComplexCardProps) {
  return (
    <Card className="bg-[var(--krat-bg2)] border-[var(--krat-border)] rounded-[var(--krat-radius)] shadow-none">
      <CardContent className="p-4">
        <div className="text-[14px] font-semibold truncate mb-0.5">{complex.name}</div>
        <div className="text-[11px] text-[var(--krat-tx3)] mb-3">
          {complex.district} · {complex.subtypeLabel}
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-[18px] font-bold text-[var(--krat-green)] leading-none">
              {complex.robots.operating}
            </div>
            <div className="text-[10px] text-[var(--krat-tx3)] mt-1">가동</div>
          </div>
          <div className="text-center">
            <div className="text-[18px] font-bold text-[var(--krat-accent)] leading-none">
              {complex.robots.charging}
            </div>
            <div className="text-[10px] text-[var(--krat-tx3)] mt-1">충전</div>
          </div>
          <div className="text-center">
            <div
              className={`text-[18px] font-bold leading-none ${
                complex.robots.error > 0
                  ? "text-[var(--krat-red)]"
                  : "text-[var(--krat-tx3)]"
              }`}
            >
              {complex.robots.error}
            </div>
            <div className="text-[10px] text-[var(--krat-tx3)] mt-1">에러</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
