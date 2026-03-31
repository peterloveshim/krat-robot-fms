import type { JSX } from "react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { AlertTriangle, Search, Clock } from "lucide-react";
import type { Incident, IncidentSeverity, IncidentStatus } from "@/lib/mock-data";

/** 심각도별 좌측 바 색상 */
function getSeverityBarClass(severity: IncidentSeverity): string {
  switch (severity) {
    case "CRITICAL":
      return "bg-destructive";
    case "HIGH":
      return "bg-amber-400";
    case "MEDIUM":
      return "bg-primary";
    case "LOW":
      return "bg-muted-foreground";
  }
}

/** 심각도 아이콘 */
function SeverityIcon({ severity }: { severity: IncidentSeverity }): JSX.Element {
  const colorMap: Record<IncidentSeverity, string> = {
    CRITICAL: "text-destructive",
    HIGH: "text-amber-400",
    MEDIUM: "text-primary",
    LOW: "text-muted-foreground",
  };

  const isCritical = severity === "CRITICAL" || severity === "HIGH";

  return (
    <div className="relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#1a1a1a] border border-border">
      <AlertTriangle size={14} className={colorMap[severity]} />
      {isCritical && (
        <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
          severity === "CRITICAL" ? "bg-destructive" : "bg-amber-400"
        }`}>
          <span className={`absolute inset-0 rounded-full animate-ping opacity-40 ${
            severity === "CRITICAL" ? "bg-destructive" : "bg-amber-400"
          }`} />
        </span>
      )}
    </div>
  );
}

function IncidentStatusBadge({ status }: { status: IncidentStatus }): JSX.Element {
  const config: Record<IncidentStatus, { label: string; className: string; icon: React.ReactNode }> = {
    OPEN: {
      label: "OPEN",
      className: "bg-transparent border border-destructive/50 text-destructive hover:bg-transparent",
      icon: <AlertTriangle size={10} />,
    },
    INVESTIGATING: {
      label: "조사중",
      className: "bg-transparent border border-[#4a3800] text-[#e5a020] hover:bg-transparent",
      icon: <Search size={10} />,
    },
    RESOLVED: {
      label: "해결됨",
      className: "bg-transparent border border-[#1a3a1a] text-[#34d058] hover:bg-transparent",
      icon: null,
    },
    CLOSED: {
      label: "종료",
      className: "bg-transparent border border-border text-muted-foreground hover:bg-transparent",
      icon: null,
    },
  };
  const c = config[status];
  return (
    <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-md gap-1 ${c.className}`}>
      {c.icon}
      {c.label}
    </Badge>
  );
}

function SeverityLabel({ severity }: { severity: IncidentSeverity }): JSX.Element {
  const config: Record<IncidentSeverity, { label: string; className: string }> = {
    CRITICAL: { label: "CRITICAL", className: "text-destructive" },
    HIGH: { label: "HIGH", className: "text-amber-400" },
    MEDIUM: { label: "MEDIUM", className: "text-primary" },
    LOW: { label: "LOW", className: "text-muted-foreground" },
  };
  const c = config[severity];
  return (
    <span className={`text-[9px] font-bold tracking-[0.1em] uppercase ${c.className}`}>
      {c.label}
    </span>
  );
}

const INCIDENTS_MAX = 6;

function IncidentSkeletonItem(): JSX.Element {
  return (
    <div className="relative bg-card border border-border rounded-xl overflow-hidden">
      <div className="absolute left-0 top-0 w-[3px] h-full bg-white/[0.04] opacity-40" />
      <div className="pl-5 pr-4 py-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] animate-pulse opacity-40 flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="h-[9px] w-16 rounded bg-white/[0.04] animate-pulse opacity-40" />
          <div className="h-[13px] w-36 rounded bg-white/[0.04] animate-pulse opacity-40" />
          <div className="h-[11px] w-24 rounded bg-white/[0.04] animate-pulse opacity-25" />
        </div>
        <div className="h-[20px] w-14 rounded-md bg-white/[0.04] animate-pulse opacity-40 flex-shrink-0" />
      </div>
    </div>
  );
}

type IncidentListProps = { incidents: Incident[] };

export function IncidentList({ incidents }: IncidentListProps): JSX.Element {
  const shown = incidents.slice(0, INCIDENTS_MAX);
  const skeletonCount = Math.max(0, INCIDENTS_MAX - shown.length);

  return (
    <section className="h-full flex flex-col">
      <SectionHeader title="인시던트" action="전체 보기 →" />
      <div className="flex-1 flex flex-col gap-2">
        {shown.map((incident) => (
          <div
            key={incident.id}
            className={`group relative rounded-xl overflow-hidden transition-colors duration-200 border ${
              incident.severity === "CRITICAL"
                ? "bg-[#180000] border-destructive/40"
                : incident.severity === "HIGH"
                ? "bg-card border-[#2a1a00]"
                : "bg-card border-border"
            }`}
          >
            {/* 좌측 심각도 바 */}
            <div className={`absolute left-0 top-0 w-[3px] h-full ${getSeverityBarClass(incident.severity)}`} />

            <div className="pl-5 pr-4 py-3.5">
              <div className="flex items-center gap-3">
                <SeverityIcon severity={incident.severity} />

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <SeverityLabel severity={incident.severity} />
                    <span className="text-muted-foreground">·</span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock size={9} />
                      {new Date(incident.occurredAt).toLocaleString("ko-KR", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-foreground truncate group-hover:text-white transition-colors">
                    {incident.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {incident.complexName} · {incident.zoneName}
                  </div>
                </div>

                <IncidentStatusBadge status={incident.status} />
              </div>
            </div>
          </div>
        ))}
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <IncidentSkeletonItem key={`skeleton-${i}`} />
        ))}
      </div>
    </section>
  );
}
