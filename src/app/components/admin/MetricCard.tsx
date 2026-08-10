import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Panel } from "./ui";

export function MetricCard({
  label,
  value,
  sublabel,
  delta,
  deltaLabel = "vs. previous period",
}: {
  label: string;
  value: string;
  sublabel?: string;
  delta?: number;
  deltaLabel?: string;
}) {
  return (
    <Panel>
      <p className="text-xs font-medium text-[#667085] mb-2">{label}</p>
      <p className="text-2xl font-semibold text-[#101828] tabular-nums">{value}</p>
      <div className="flex items-center gap-2 mt-2">
        {typeof delta === "number" && <DeltaPill delta={delta} />}
        {sublabel && <p className="text-xs text-[#98A2B3]">{sublabel}</p>}
      </div>
      {typeof delta === "number" && <p className="text-[11px] text-[#98A2B3] mt-1">{deltaLabel}</p>}
    </Panel>
  );
}

export function DeltaPill({ delta }: { delta: number }) {
  const positive = delta > 0;
  const flat = delta === 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        flat ? "text-gray-500" : positive ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {flat ? <Minus size={12} /> : positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(delta)}%
    </span>
  );
}

export function DmoMetricCard({
  label,
  individual,
  operatingGroup,
  overallBank,
  target,
  achievement,
  previousPeriod,
  source,
  refreshedAt,
  completeness,
}: {
  label: string;
  individual: string;
  operatingGroup: string;
  overallBank: string;
  target: string;
  achievement: number;
  previousPeriod: number;
  source: string;
  refreshedAt: string;
  completeness: string;
}) {
  const delta = achievement - previousPeriod;
  return (
    <Panel>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-semibold text-[#101828]">{label}</p>
        <DeltaPill delta={delta} />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#98A2B3] mb-0.5">Individual Staff</p>
          <p className="text-sm font-semibold text-[#101828] tabular-nums">{individual}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#98A2B3] mb-0.5">Operating Group</p>
          <p className="text-sm font-semibold text-[#101828] tabular-nums">{operatingGroup}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#98A2B3] mb-0.5">Overall Bank</p>
          <p className="text-sm font-semibold text-[#101828] tabular-nums">{overallBank}</p>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-[#667085] mb-1">
          <span>Target: {target}</span>
          <span className="font-medium text-[#101828]">{achievement}% achieved</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#5584CE]"
            style={{ width: `${Math.min(achievement, 100)}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-[#98A2B3] pt-2 border-t border-gray-100 mt-2">
        <span>{source}</span>
        <span>
          {completeness} · refreshed {refreshedAt}
        </span>
      </div>
    </Panel>
  );
}
