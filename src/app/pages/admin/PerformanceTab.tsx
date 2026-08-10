import { useState } from "react";
import { Link } from "react-router";
import { Info } from "lucide-react";
import { SectionCard } from "@/app/components/admin/ui";
import { DmoMetricCard } from "@/app/components/admin/MetricCard";
import { dmoMetrics, performanceBreakdown } from "@/app/lib/mockData";
import { HorizontalBarList } from "@/app/components/admin/charts";

const scopes = ["Individual Staff", "Operating Group / Business Unit", "Overall Bank"] as const;

export default function PerformanceTab() {
  const [scope, setScope] = useState<(typeof scopes)[number]>("Overall Bank");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {scopes.map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                scope === s ? "bg-[#5584CE] text-white" : "text-[#344054] hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Link to="/data/metrics" className="text-xs font-medium text-[#5584CE] hover:underline flex items-center gap-1">
          <Info size={13} /> Metric definitions & data lineage
        </Link>
      </div>

      <p className="text-xs text-[#667085] mb-4">
        Viewing <span className="font-medium text-[#101828]">{scope}</span> scope. Authorised users may drill from
        Overall Bank down to Operating Group, Business Unit, department, location and individual staff. Each tile
        below shows all three levels for comparison.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {dmoMetrics.map((m) => {
          const { key, ...rest } = m;
          return <DmoMetricCard key={key} {...rest} />;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title="Top-performing entities">
          <HorizontalBarList items={performanceBreakdown.topEntities} />
        </SectionCard>
        <SectionCard title="Top-performing regions">
          <HorizontalBarList items={performanceBreakdown.topRegions} color="#EE7E01" />
        </SectionCard>
        <SectionCard title="Highest-performing employee cohorts">
          <HorizontalBarList items={performanceBreakdown.highestCohorts} color="#16A34A" />
        </SectionCard>
      </div>
    </>
  );
}
