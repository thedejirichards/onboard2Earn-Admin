import { useMemo, useState } from "react";
import { Download, ExternalLink, RefreshCw } from "lucide-react";
import { PrimaryButton, SecondaryButton, SelectFilter, Toolbar } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { useToast } from "@/app/components/admin/Toast";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { artefacts as initialArtefacts } from "@/app/lib/mockData";
import { downloadCsv } from "@/app/lib/csv";
import type { ArtefactRecord } from "@/app/lib/types";

const statuses = Array.from(new Set(initialArtefacts.map((a) => a.status)));

export default function ArtefactReconciliationPage() {
  const showToast = useToast();
  const [artefacts, setArtefacts] = useState(initialArtefacts);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<ArtefactRecord | null>(null);
  usePageHeader(
    "Artefact Reconciliation",
    "Monitor artefact synchronisation to the account-opening records portal."
  );

  const rows = useMemo(() => artefacts.filter((a) => !status || a.status === status), [artefacts, status]);

  function updateSelected(patch: Partial<ArtefactRecord>) {
    if (!selected) return;
    const updated = { ...selected, ...patch };
    setSelected(updated);
    setArtefacts((prev) => prev.map((a) => (a.journeyReference === selected.journeyReference ? updated : a)));
  }

  const summary = [
    { label: "Successfully synchronised", count: artefacts.filter((a) => a.status === "Stored successfully").length },
    { label: "Pending synchronisation", count: artefacts.filter((a) => a.status === "Pending synchronisation").length },
    { label: "Failed synchronisations", count: artefacts.filter((a) => a.status === "Failed").length },
    { label: "Requires manual investigation", count: artefacts.filter((a) => a.status === "Failed" || a.status === "Reconciliation required").length },
  ];

  const columns: Column<ArtefactRecord>[] = [
    { key: "journey", header: "Journey reference", render: (a) => <span className="font-medium text-[#101828]">{a.journeyReference}</span> },
    { key: "aor", header: "Account-opening ref.", render: (a) => a.accountOpeningReference },
    { key: "account", header: "Account number", render: (a) => a.accountNumber },
    { key: "customer", header: "Customer", render: (a) => a.customer },
    { key: "opened", header: "Date opened", render: (a) => a.dateOpened },
    { key: "artefacts", header: "Artefacts stored", render: (a) => `${a.storedArtefacts} / ${a.expectedArtefacts}` },
    { key: "status", header: "Sync status", render: (a) => <StatusBadge status={a.status} /> },
    { key: "retry", header: "Retry count", render: (a) => a.retryCount },
    { key: "owner", header: "Owner", render: (a) => a.owner ?? <span className="text-[#98A2B3]">—</span> },
    actionsColumn<ArtefactRecord>(setSelected, "View"),
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl border border-black/[0.06] bg-white p-4">
            <p className="text-xs text-[#667085] mb-1">{s.label}</p>
            <p className="text-xl font-semibold text-[#101828]">{s.count}</p>
          </div>
        ))}
      </div>

      <Toolbar
        actions={
          <SecondaryButton
            onClick={() =>
              downloadCsv(
                "artefact-reconciliation",
                rows.map((a) => ({
                  journeyReference: a.journeyReference,
                  accountOpeningReference: a.accountOpeningReference,
                  accountNumber: a.accountNumber,
                  customer: a.customer,
                  dateOpened: a.dateOpened,
                  storedArtefacts: a.storedArtefacts,
                  expectedArtefacts: a.expectedArtefacts,
                  status: a.status,
                  retryCount: a.retryCount,
                  owner: a.owner ?? "",
                }))
              )
            }
          >
            <Download size={14} /> Export
          </SecondaryButton>
        }
      >
        <SelectFilter label="Synchronisation status" value={status} onChange={setStatus} options={statuses} className="w-full" />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={rows}
        keyField={(a) => a.journeyReference}
      />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.accountOpeningReference ?? ""} subtitle={selected?.customer}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge status={selected.status} />

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Journey reference" value={selected.journeyReference} />
              <Field label="Account number" value={selected.accountNumber} />
              <Field label="Date generated / submitted" value={selected.dateOpened} />
              <Field label="Repository reference" value={selected.repositoryReference} />
              <Field label="Last attempt" value={selected.lastAttempt} />
              <Field label="Retry count" value={selected.retryCount} />
            </dl>

            <div>
              <p className="text-xs font-medium text-[#344054] mb-2">Expected artefacts</p>
              <div className="space-y-1.5">
                {Array.from({ length: selected.expectedArtefacts }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between text-xs rounded-lg border border-gray-100 px-3 py-2">
                    <span className="text-[#344054]">Artefact {i + 1} of {selected.expectedArtefacts}</span>
                    <StatusBadge status={i < selected.storedArtefacts ? "Stored successfully" : "Failed"} />
                  </div>
                ))}
              </div>
            </div>

            {selected.lastError && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3.5 py-3">
                <p className="text-xs text-red-700"><span className="font-medium">Last error:</span> {selected.lastError}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <PrimaryButton
                onClick={() => {
                  updateSelected({
                    status: "Stored successfully",
                    storedArtefacts: selected.expectedArtefacts,
                    retryCount: selected.retryCount + 1,
                    lastAttempt: "Just now",
                    lastError: null,
                  });
                  showToast(`Synchronisation retried for ${selected.journeyReference} — all artefacts now stored.`);
                }}
              >
                <RefreshCw size={14} /> Retry synchronisation
              </PrimaryButton>
              <SecondaryButton
                onClick={() => {
                  updateSelected({ status: "Stored successfully" });
                  showToast(`${selected.journeyReference} reconciled against the account-opening repository.`);
                }}
              >
                Reconcile with repository
              </SecondaryButton>
              <SecondaryButton
                onClick={() => showToast("The records portal is an external system and isn't connected in this demo.")}
              >
                <ExternalLink size={14} /> Open in records portal
              </SecondaryButton>
            </div>
            <p className="text-[11px] text-[#98A2B3] border-t border-gray-100 pt-3">
              A retry will not recreate the account or create duplicate artefact records.
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
