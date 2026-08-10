import { useState } from "react";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { customerRewards } from "@/app/lib/mockData";
import { formatNaira, formatNumber } from "@/app/lib/format";
import type { CustomerRewardEligibility } from "@/app/lib/types";
import { AlertCircle } from "lucide-react";

export default function CustomerRewardsPage() {
  const [selected, setSelected] = useState<CustomerRewardEligibility | null>(null);
  usePageHeader(
    "Customer Rewards",
    "DiamondXtra Season 18 — a separate customer reward proposition."
  );

  const columns: Column<CustomerRewardEligibility>[] = [
    { key: "tier", header: "Tier", render: (r) => <span className="font-medium text-[#101828]">{r.tier}</span> },
    { key: "cadence", header: "Cadence", render: (r) => r.cadence },
    { key: "criteria", header: "Rewardees", render: (r) => r.customerRef },
    { key: "balance", header: "Min. balance increase", render: (r) => formatNaira(r.balanceIncrease) },
    { key: "transactions", header: "Min. transactions", render: (r) => formatNumber(r.transactions) },
    { key: "reward", header: "Reward", render: (r) => formatNaira(r.reward) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    actionsColumn<CustomerRewardEligibility>(setSelected, "View"),
  ];

  return (
    <div>
      <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 flex items-start gap-2.5 mb-6">
        <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          Customer reward values must never be combined with employee Onboard &amp; Earn points or staff reward
          eligibility. Fulfilment for customer rewards is owned by another approved platform, not this portal.
        </p>
      </div>

      <DataTable columns={columns} rows={customerRewards} keyField={(r) => r.id} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.tier ?? ""} subtitle={selected?.cadence}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge status={selected.status} />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Rewardees" value={selected.customerRef} />
              <Field label="Cadence" value={selected.cadence} />
              <Field label="Min. balance increase" value={formatNaira(selected.balanceIncrease)} />
              <Field label="Min. transactions" value={formatNumber(selected.transactions)} />
              <Field label="Reward" value={formatNaira(selected.reward)} />
            </dl>
            <p className="text-[11px] text-[#98A2B3] border-t border-gray-100 pt-3">
              Fulfilment for customer rewards is owned by another approved platform. This portal reflects
              eligibility for campaign visibility and communication purposes only.
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
