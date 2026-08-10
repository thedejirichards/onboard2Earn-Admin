import { useState } from "react";
import { Plus } from "lucide-react";
import { Panel, PrimaryButton, SectionCard } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { campaigns } from "@/app/lib/mockData";
import { formatNaira, formatNumber } from "@/app/lib/format";
import type { Campaign } from "@/app/lib/types";

export default function CampaignsPage() {
  const [selected, setSelected] = useState<Campaign | null>(null);
  usePageHeader(
    "Campaigns",
    "Configure campaign rules, milestones, targets and comparison groups."
  );

  const columns: Column<Campaign>[] = [
    { key: "name", header: "Campaign", render: (c) => <span className="font-medium text-[#101828]">{c.name}</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "period", header: "Period", render: (c) => `${c.startDate} → ${c.endDate}` },
    { key: "scope", header: "Eligible scope", render: (c) => c.eligibleScope },
    { key: "participants", header: "Participants", render: (c) => formatNumber(c.participants) },
    { key: "points", header: "Points issued", render: (c) => formatNumber(c.pointsIssued) },
    { key: "reward", header: "Reward status", render: (c) => <StatusBadge status={c.rewardStatus} /> },
    { key: "version", header: "Config version", render: (c) => c.configVersion },
    actionsColumn<Campaign>(setSelected, "View"),
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PrimaryButton><Plus size={14} /> New campaign</PrimaryButton>
      </div>

      <DataTable columns={columns} rows={campaigns} keyField={(c) => c.id} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} subtitle={selected ? `${selected.id} · ${selected.configVersion}` : undefined}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge status={selected.status} />

            <div className="grid grid-cols-2 gap-3">
              <Panel padded className="!p-3.5">
                <p className="text-xs text-[#98A2B3] mb-1">Account-count target</p>
                <p className="text-sm font-semibold text-[#101828]">{formatNumber(selected.accountsAchieved)} / {formatNumber(selected.accountTarget)}</p>
                <Progress value={selected.accountsAchieved} max={selected.accountTarget} />
              </Panel>
              <Panel padded className="!p-3.5">
                <p className="text-xs text-[#98A2B3] mb-1">CASA mobilisation target</p>
                <p className="text-sm font-semibold text-[#101828]">{formatNaira(selected.casaAchieved)} / {formatNaira(selected.casaTarget)}</p>
                <Progress value={selected.casaAchieved} max={selected.casaTarget} />
              </Panel>
            </div>

            <SectionCard title="Milestone configuration">
              <div className="space-y-2">
                {selected.milestones.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-xs rounded-lg border border-gray-100 px-3 py-2.5">
                    <div>
                      <p className="text-[#344054] font-medium">{m.name}</p>
                      <p className="text-[#98A2B3]">Source: {m.eventSource}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#101828] font-semibold">{m.points} pts</p>
                      <StatusBadge status={m.status} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Eligible scope" value={selected.eligibleScope} />
              <Field label="Participants" value={formatNumber(selected.participants)} />
              <Field label="Last updated by" value={selected.lastUpdatedBy} />
              <Field label="Configuration version" value={selected.configVersion} />
            </dl>

            <p className="text-[11px] text-[#98A2B3] border-t border-gray-100 pt-3">
              Manual adjustments require a reason, supporting reference, approval where required, and a complete audit trail.
              Customer reward values are never combined with employee points or reward eligibility.
            </p>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Progress({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mt-2">
      <div className="h-full rounded-full bg-[#5584CE]" style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-[#98A2B3] mb-1">{label}</dt>
      <dd className="text-[#101828] font-medium">{value}</dd>
    </div>
  );
}
