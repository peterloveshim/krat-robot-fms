import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { incidents } from "@/lib/mock-data";
import type { IncidentSeverity, IncidentStatus } from "@/lib/mock-data";

function SeverityDot({ severity }: { severity: IncidentSeverity }) {
  const colorMap: Record<IncidentSeverity, string> = {
    CRITICAL: "bg-[var(--krat-red)]",
    HIGH: "bg-[var(--krat-amber)]",
    MEDIUM: "bg-[var(--krat-accent)]",
    LOW: "bg-[var(--krat-tx3)]",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${colorMap[severity]}`}
    />
  );
}

function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const config: Record<IncidentStatus, { label: string; className: string }> = {
    OPEN: {
      label: "OPEN",
      className: "bg-[var(--krat-red-bg)] text-[var(--krat-red)] hover:bg-[var(--krat-red-bg)]",
    },
    INVESTIGATING: {
      label: "조사중",
      className: "bg-[var(--krat-amber-bg)] text-[var(--krat-amber)] hover:bg-[var(--krat-amber-bg)]",
    },
    RESOLVED: {
      label: "해결됨",
      className: "bg-[var(--krat-green-bg)] text-[var(--krat-green)] hover:bg-[var(--krat-green-bg)]",
    },
    CLOSED: {
      label: "종료",
      className: "bg-[rgba(255,255,255,0.06)] text-[var(--krat-tx3)] hover:bg-[rgba(255,255,255,0.06)]",
    },
  };
  const c = config[status];
  return (
    <Badge className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  const config: Record<IncidentSeverity, { label: string; className: string }> = {
    CRITICAL: {
      label: "CRITICAL",
      className: "bg-[var(--krat-red-bg)] text-[var(--krat-red)] hover:bg-[var(--krat-red-bg)]",
    },
    HIGH: {
      label: "HIGH",
      className: "bg-[var(--krat-amber-bg)] text-[var(--krat-amber)] hover:bg-[var(--krat-amber-bg)]",
    },
    MEDIUM: {
      label: "MEDIUM",
      className: "bg-[rgba(59,130,246,0.12)] text-[var(--krat-accent)] hover:bg-[rgba(59,130,246,0.12)]",
    },
    LOW: {
      label: "LOW",
      className: "bg-[rgba(255,255,255,0.06)] text-[var(--krat-tx3)] hover:bg-[rgba(255,255,255,0.06)]",
    },
  };
  const c = config[severity];
  return (
    <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${c.className}`}>
      {c.label}
    </Badge>
  );
}

export function IncidentList() {
  return (
    <section className="mb-7">
      <SectionHeader title="인시던트" action="전체 보기 →" />
      <div className="flex flex-col gap-2">
        {incidents.map((incident) => (
          <Card
            key={incident.id}
            className="bg-[var(--krat-bg2)] border-[var(--krat-border)] rounded-[var(--krat-radius)] shadow-none"
          >
            <CardContent className="px-4 py-3.5">
              <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3">
                <SeverityDot severity={incident.severity} />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{incident.title}</div>
                  <div className="text-[11px] text-[var(--krat-tx3)] mt-0.5">
                    {incident.complexName} · {incident.zoneName} · {incident.occurredAt}
                  </div>
                </div>
                <IncidentStatusBadge status={incident.status} />
                <SeverityBadge severity={incident.severity} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
