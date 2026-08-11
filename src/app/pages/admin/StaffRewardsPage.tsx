import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { SecondaryButton, SelectFilter, Toolbar } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { staffRewards } from "@/app/lib/mockData";
import { downloadCsv } from "@/app/lib/csv";
import { formatNaira, formatNumber } from "@/app/lib/format";
import type { StaffRewardEligibility } from "@/app/lib/types";

const categories = ["Grand Finale", "Milestone", "Sustaining Momentum"];

const sustainingGates = [
  { label: "Month 1 gate", requirement: "Min. 80% of monthly account-count & CASA targets across the 35 approved groups", result: "Pass" },
  { label: "Month 2 gate", requirement: "Min. 80% of cumulative account-count & CASA targets across the 35 approved groups", result: "Pass" },
  { label: "Month 3 gate", requirement: "Min. 80% of cumulative account-count & CASA targets across the 35 approved groups", result: "Pending" },
];

export default function StaffRewardsPage() {
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<StaffRewardEligibility | null>(null);
  usePageHeader(
    "Staff Rewards",
    "Grand Finale, Milestone and Sustaining Momentum reward eligibility."
  );

  const rows = useMemo(() => staffRewards.filter((r) => !category || r.category === category), [category]);

  const columns: Column<StaffRewardEligibility>[] = [
    { key: "category", header: "Category", render: (r) => r.category },
    { key: "position", header: "Rank / position", render: (r) => <span className="font-medium text-[#101828]">{r.rankOrPosition}</span> },
    { key: "employee", header: "Employee / group", render: (r) => r.employeeOrGroup },
    { key: "accounts", header: "Accounts opened", render: (r) => formatNumber(r.accountsOpened) },
    { key: "funded", header: "Funded accounts", render: (r) => formatNumber(r.fundedAccounts) },
    { key: "deposit", header: "Deposit mobilised", render: (r) => formatNaira(r.depositMobilised) },
    { key: "achievement", header: "Target achievement", render: (r) => `${r.targetAchievement}%` },
    { key: "gate", header: "Gate result", render: (r) => <StatusBadge status={r.gateResult} /> },
    { key: "reward", header: "Proposed reward", render: (r) => r.proposedReward },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    actionsColumn<StaffRewardEligibility>(setSelected, "View"),
  ];

  return (
    <div>
      <div className="rounded-xl border border-black/[0.06] bg-white p-5 mb-6">
        <h3 className="text-sm font-semibold text-[#101828] mb-1">Sustaining Momentum eligibility gates</h3>
        <p className="text-xs text-[#667085] mb-4">The portal validates each monthly gate before ranking or approving a Sustaining Momentum reward.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sustainingGates.map((g) => (
            <div key={g.label} className="rounded-lg border border-gray-100 px-3.5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-[#344054]">{g.label}</p>
                <StatusBadge status={g.result} />
              </div>
              <p className="text-[11px] text-[#98A2B3]">{g.requirement}</p>
            </div>
          ))}
        </div>
      </div>

      <Toolbar
        actions={
          <SecondaryButton
            onClick={() =>
              downloadCsv(
                "staff-rewards-eligibility",
                rows.map((r) => ({
                  category: r.category,
                  rankOrPosition: r.rankOrPosition,
                  employeeOrGroup: r.employeeOrGroup,
                  accountsOpened: r.accountsOpened,
                  fundedAccounts: r.fundedAccounts,
                  depositMobilised: r.depositMobilised,
                  targetAchievement: r.targetAchievement,
                  gateResult: r.gateResult,
                  proposedReward: r.proposedReward,
                  status: r.status,
                }))
              )
            }
          >
            <Download size={14} /> Export eligibility
          </SecondaryButton>
        }
      >
        <SelectFilter label="Reward category" value={category} onChange={setCategory} options={categories} className="w-full" />
      </Toolbar>

      <DataTable columns={columns} rows={rows} keyField={(r) => r.id} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.rankOrPosition ?? ""} subtitle={selected?.category}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <StatusBadge status={selected.gateResult} />
              <StatusBadge status={selected.status} />
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Employee / group" value={selected.employeeOrGroup} />
              <Field label="Proposed reward" value={selected.proposedReward} />
              <Field label="Accounts opened" value={formatNumber(selected.accountsOpened)} />
              <Field label="Funded accounts" value={formatNumber(selected.fundedAccounts)} />
              <Field label="Deposit mobilised" value={formatNaira(selected.depositMobilised)} />
              <Field label="Target achievement" value={`${selected.targetAchievement}%`} />
            </dl>
            <p className="text-[11px] text-[#98A2B3] border-t border-gray-100 pt-3">
              High-value rewards and manual adjustments follow maker-checker approval and are fully auditable.
            </p>
          </div>
        )}
      </Drawer>
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
