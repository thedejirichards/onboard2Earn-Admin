import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { SecondaryButton, SelectFilter, TextFilter, Toolbar } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { auditLogs } from "@/app/lib/mockData";
import type { AuditLogEntry } from "@/app/lib/types";

const modules = Array.from(new Set(auditLogs.map((a) => a.module)));

export default function AuditLogsPage() {
  const [module, setModule] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AuditLogEntry | null>(null);
  usePageHeader(
    "Audit Logs",
    "Read-only, searchable log of all administrative and system actions."
  );

  const rows = useMemo(
    () =>
      auditLogs.filter(
        (a) =>
          (!module || a.module === module) &&
          (!query ||
            a.user.toLowerCase().includes(query.toLowerCase()) ||
            a.recordAffected.toLowerCase().includes(query.toLowerCase()))
      ),
    [module, query]
  );

  const columns: Column<AuditLogEntry>[] = [
    { key: "datetime", header: "Date & time", render: (a) => <span className="text-[#667085]">{a.dateTime}</span> },
    { key: "user", header: "User", render: (a) => <div><p className="font-medium text-[#101828]">{a.user}</p><p className="text-[11px] text-[#98A2B3]">{a.staffId}</p></div> },
    { key: "role", header: "Role", render: (a) => a.role },
    { key: "module", header: "Module", render: (a) => a.module },
    { key: "action", header: "Action", render: (a) => a.action },
    { key: "record", header: "Record affected", render: (a) => <span className="font-mono text-xs">{a.recordAffected}</span> },
    { key: "outcome", header: "Outcome", render: (a) => <StatusBadge status={a.outcome} /> },
    { key: "approval", header: "Approval reference", render: (a) => a.approvalReference ?? "—" },
    actionsColumn<AuditLogEntry>(setSelected, "View"),
  ];

  return (
    <div>
      <Toolbar
        columns={3}
        actions={
          <SecondaryButton><Download size={14} /> Export audit report</SecondaryButton>
        }
      >
        <TextFilter value={query} onChange={setQuery} placeholder="Search user or record..." className="w-full col-span-2" />
        <SelectFilter label="Module" value={module} onChange={setModule} options={modules} className="w-full" />
      </Toolbar>

      <DataTable columns={columns} rows={rows} keyField={(a) => a.id} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.action ?? ""} subtitle={selected?.recordAffected}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge status={selected.outcome} />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Date & time" value={selected.dateTime} />
              <Field label="User" value={`${selected.user} · ${selected.staffId}`} />
              <Field label="Role" value={selected.role} />
              <Field label="Module" value={selected.module} />
              <Field label="Record affected" value={selected.recordAffected} />
              <Field label="Approval reference" value={selected.approvalReference ?? "—"} />
            </dl>
            {(selected.previousValue || selected.newValue) && (
              <dl className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
                <Field label="Previous value" value={selected.previousValue ?? "—"} />
                <Field label="New value" value={selected.newValue ?? "—"} />
              </dl>
            )}
            {selected.reason && (
              <div className="rounded-lg bg-gray-50 border border-gray-100 px-3.5 py-3">
                <p className="text-xs text-[#344054]"><span className="font-medium">Reason:</span> {selected.reason}</p>
              </div>
            )}
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
