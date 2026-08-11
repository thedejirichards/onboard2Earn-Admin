import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AlertCircle, ArrowRight, Send, UserPlus } from "lucide-react";
import { PrimaryButton, SecondaryButton, SelectFilter, Toolbar } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import StatusBadge from "@/app/components/admin/StatusBadge";
import AssignOwnerModal from "@/app/components/admin/AssignOwnerModal";
import { useToast } from "@/app/components/admin/Toast";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { exceptions as initialExceptions } from "@/app/lib/mockData";
import type { ExceptionCase } from "@/app/lib/types";

const types = Array.from(new Set(initialExceptions.map((e) => e.type)));
const priorities = ["Critical", "High", "Medium", "Low"];
const statuses = ["Open", "In review", "Escalated", "Resolved"];

export default function ExceptionsPage() {
  const showToast = useToast();
  const [exceptions, setExceptions] = useState(initialExceptions);
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<ExceptionCase | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  usePageHeader(
    "Exceptions",
    "Queues for cases requiring operational or compliance attention."
  );

  const rows = useMemo(
    () =>
      exceptions.filter(
        (e) => (!type || e.type === type) && (!priority || e.priority === priority) && (!status || e.status === status)
      ),
    [exceptions, type, priority, status]
  );

  function updateSelected(patch: Partial<ExceptionCase>) {
    if (!selected) return;
    const updated = { ...selected, ...patch };
    setSelected(updated);
    setExceptions((prev) => prev.map((e) => (e.id === selected.id ? updated : e)));
  }

  const summary = [
    { label: "Open", count: exceptions.filter((e) => e.status === "Open").length },
    { label: "In review", count: exceptions.filter((e) => e.status === "In review").length },
    { label: "Escalated", count: exceptions.filter((e) => e.status === "Escalated").length },
    { label: "Breached SLA", count: exceptions.filter((e) => e.slaStatus === "Breached").length },
  ];

  const columns: Column<ExceptionCase>[] = [
    { key: "id", header: "Exception", render: (e) => <span className="font-medium text-[#101828]">{e.id}</span> },
    { key: "type", header: "Type", render: (e) => e.type },
    { key: "journey", header: "Journey", render: (e) => <span className="text-[#344054]">{e.journeyReference}</span> },
    { key: "customer", header: "Customer", render: (e) => e.customer },
    { key: "staff", header: "Initiating staff", render: (e) => e.initiatingStaff },
    { key: "age", header: "Age", render: (e) => `${e.ageDays}d` },
    { key: "priority", header: "Priority", render: (e) => <StatusBadge status={e.priority} /> },
    { key: "sla", header: "SLA", render: (e) => <StatusBadge status={e.slaStatus} /> },
    { key: "owner", header: "Owner", render: (e) => e.owner ?? <span className="text-[#98A2B3]">Unassigned</span> },
    { key: "status", header: "Status", render: (e) => <StatusBadge status={e.status} /> },
    actionsColumn<ExceptionCase>(setSelected, "View"),
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

      <Toolbar>
        <SelectFilter label="Exception type" value={type} onChange={setType} options={types} className="w-full" />
        <SelectFilter label="Priority" value={priority} onChange={setPriority} options={priorities} className="w-full" />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={statuses} className="w-full" />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={rows}
        keyField={(e) => e.id}
        emptyTitle="No exceptions require attention"
        emptyDescription="There are currently no unresolved exceptions within your authorised scope."
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? ""}
        subtitle={selected?.type}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <StatusBadge status={selected.priority} />
              <StatusBadge status={selected.slaStatus} />
              <StatusBadge status={selected.status} />
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-100 px-3.5 py-3 flex items-start gap-2.5">
              <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Recommended next action: <span className="font-medium">{selected.recommendedAction}</span>
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Journey reference" value={
                <Link to={`/journeys/${selected.journeyReference}`} className="text-[#5584CE] hover:underline flex items-center gap-1">
                  {selected.journeyReference} <ArrowRight size={12} />
                </Link>
              } />
              <Field label="Customer" value={selected.customer} />
              <Field label="Initiating staff" value={selected.initiatingStaff} />
              <Field label="Organisational unit" value={selected.orgUnit} />
              <Field label="Date raised" value={selected.dateRaised} />
              <Field label="Age" value={`${selected.ageDays} days`} />
              <Field label="Owner" value={selected.owner ?? "Unassigned"} />
              <Field label="Last action" value={selected.lastAction} />
            </dl>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-[#344054] mb-2">Add note</p>
              <textarea
                rows={3}
                placeholder="Record an operational note for this exception..."
                className="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5584CE]/20 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <PrimaryButton onClick={() => setAssignOpen(true)}><UserPlus size={14} /> Assign owner</PrimaryButton>
              <SecondaryButton
                onClick={() => showToast(`Consent communication resent to ${selected.customer}.`)}
              >
                <Send size={14} /> Resend communication
              </SecondaryButton>
              <SecondaryButton
                onClick={() => showToast(`${selected.id} routed to the Compliance queue.`)}
              >
                Route to Compliance
              </SecondaryButton>
              <SecondaryButton
                onClick={() => {
                  updateSelected({ status: "Escalated" });
                  showToast(`${selected.id} escalated.`);
                }}
              >
                Escalate
              </SecondaryButton>
            </div>
            <p className="text-[11px] text-[#98A2B3] border-t border-gray-100 pt-3">
              Where a regulated override is permitted, it must be role restricted, reason based, subject to approval and fully logged.
            </p>
          </div>
        )}
      </Drawer>

      {selected && (
        <AssignOwnerModal
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          title={`Assign owner — ${selected.id}`}
          subtitle={selected.customer}
          currentOwner={selected.owner}
          onAssign={(owner) => {
            updateSelected({ owner });
            showToast(`${selected.id} assigned to ${owner}.`);
          }}
        />
      )}
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
