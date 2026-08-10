import { Panel } from "@/app/components/admin/ui";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { systemHealth } from "@/app/lib/mockData";

export default function SystemHealthPage() {
  const operational = systemHealth.filter((s) => s.status === "Operational").length;
  const degraded = systemHealth.filter((s) => s.status === "Degraded").length;
  const unavailable = systemHealth.filter((s) => s.status === "Unavailable").length;
  usePageHeader(
    "System Health",
    "Integration status across identity, verification and reporting services."
  );

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Panel><p className="text-xs text-[#667085] mb-1">Operational</p><p className="text-xl font-semibold text-emerald-600">{operational}</p></Panel>
        <Panel><p className="text-xs text-[#667085] mb-1">Degraded</p><p className="text-xl font-semibold text-amber-600">{degraded}</p></Panel>
        <Panel><p className="text-xs text-[#667085] mb-1">Unavailable</p><p className="text-xl font-semibold text-red-600">{unavailable}</p></Panel>
        <Panel><p className="text-xs text-[#667085] mb-1">Total integrations</p><p className="text-xl font-semibold text-[#101828]">{systemHealth.length}</p></Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemHealth.map((s) => (
          <Panel key={s.service}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-sm font-medium text-[#101828]">{s.service}</p>
              <StatusBadge status={s.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-[#667085]">
              <div><p className="text-[#98A2B3]">Last success</p><p className="text-[#344054] font-medium">{s.lastSuccess}</p></div>
              <div><p className="text-[#98A2B3]">Failure rate</p><p className="text-[#344054] font-medium">{s.failureRate}%</p></div>
              <div><p className="text-[#98A2B3]">Avg. response</p><p className="text-[#344054] font-medium">{s.avgResponseMs}ms</p></div>
              <div><p className="text-[#98A2B3]">Pending queue</p><p className="text-[#344054] font-medium">{s.pendingQueue}</p></div>
            </div>
            {s.openIncident && (
              <p className="text-[11px] text-red-600 mt-3 pt-3 border-t border-gray-100">Open incident: {s.openIncident}</p>
            )}
          </Panel>
        ))}
      </div>
    </div>
  );
}
