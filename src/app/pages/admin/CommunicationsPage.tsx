import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { communications } from "@/app/lib/mockData";
import { formatNumber } from "@/app/lib/format";
import type { CommunicationTemplate } from "@/app/lib/types";

export default function CommunicationsPage() {
  const [selected, setSelected] = useState<CommunicationTemplate | null>(null);
  usePageHeader(
    "Communications",
    "Consent invitations, reminders and milestone notifications."
  );

  const columns: Column<CommunicationTemplate>[] = [
    { key: "name", header: "Template", render: (c) => <span className="font-medium text-[#101828]">{c.name}</span> },
    { key: "channel", header: "Channel", render: (c) => c.channel },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "sent", header: "Sent", render: (c) => formatNumber(c.sent) },
    { key: "delivered", header: "Delivered", render: (c) => formatNumber(c.delivered) },
    { key: "failed", header: "Failed", render: (c) => formatNumber(c.failed) },
    { key: "opened", header: "Opened", render: (c) => (c.opened ? formatNumber(c.opened) : "—") },
    { key: "updated", header: "Last updated", render: (c) => c.lastUpdated },
    actionsColumn<CommunicationTemplate>(setSelected, "View"),
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PrimaryButton><Plus size={14} /> New template</PrimaryButton>
      </div>

      <DataTable columns={columns} rows={communications} keyField={(c) => c.id} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} subtitle={selected?.channel}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge status={selected.status} />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Stat label="Sent" value={selected.sent} />
              <Stat label="Delivered" value={selected.delivered} />
              <Stat label="Failed" value={selected.failed} />
              <Stat label="Opened" value={selected.opened ?? 0} />
            </div>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-xs text-[#667085] bg-gray-50/50">
              Message preview with dynamic variables (preferred customer name, masked email, journey reference,
              account type, link expiry, campaign reward information) would render here.
            </div>
            <div className="flex flex-wrap gap-2">
              <SecondaryButton><Send size={14} /> Test send</SecondaryButton>
              <SecondaryButton>Version history</SecondaryButton>
              <PrimaryButton>Submit for approval</PrimaryButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2.5">
      <p className="text-[#98A2B3] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#101828]">{formatNumber(value)}</p>
    </div>
  );
}
