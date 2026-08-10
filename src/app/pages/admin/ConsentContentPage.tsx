import { useState } from "react";
import { Eye, History, Plus } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { contentItems } from "@/app/lib/mockData";
import type { ContentItem } from "@/app/lib/types";

export default function ConsentContentPage() {
  const [selected, setSelected] = useState<ContentItem | null>(null);
  usePageHeader(
    "Consent & Attestation Content",
    "Manage the customer consent and attestation form content."
  );

  const columns: Column<ContentItem>[] = [
    { key: "name", header: "Content item", render: (c) => <div><p className="font-medium text-[#101828]">{c.name}</p><p className="text-[11px] text-[#98A2B3]">{c.category}</p></div> },
    { key: "version", header: "Version", render: (c) => c.version },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "updated", header: "Last updated", render: (c) => c.lastUpdated },
    { key: "by", header: "Updated by", render: (c) => c.updatedBy },
    actionsColumn<ContentItem>(setSelected, "View"),
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PrimaryButton><Plus size={14} /> New draft version</PrimaryButton>
      </div>

      <DataTable columns={columns} rows={contentItems} keyField={(c) => c.id} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} subtitle={selected?.category}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge status={selected.status} />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Version" value={selected.version} />
              <Field label="Last updated" value={selected.lastUpdated} />
              <Field label="Updated by" value={selected.updatedBy} />
              <Field label="Mandatory" value="Yes" />
            </dl>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-xs text-[#667085] bg-gray-50/50">
              Mobile and desktop preview of the customer-facing form would render here, including the exact question
              wording, conditional follow-ups and the review-and-submit page.
            </div>
            <div className="flex flex-wrap gap-2">
              <SecondaryButton><Eye size={14} /> Preview journey</SecondaryButton>
              <SecondaryButton><History size={14} /> Version history</SecondaryButton>
              <PrimaryButton>Submit for approval</PrimaryButton>
            </div>
            <p className="text-[11px] text-[#98A2B3] border-t border-gray-100 pt-3">
              No answer is preselected. Legal acceptance uses checkboxes; Yes/No declarations use radio buttons. Every
              change is auditable and previously completed submissions never change when a new version publishes.
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
