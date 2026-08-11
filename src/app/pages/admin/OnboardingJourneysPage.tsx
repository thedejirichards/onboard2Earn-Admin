import { useId, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Download } from "lucide-react";
import { SecondaryButton, SelectFilter, TextFilter, Toolbar } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { journeys } from "@/app/lib/mockData";
import { downloadCsv } from "@/app/lib/csv";
import type { Journey } from "@/app/lib/types";

const savedViews = [
  { label: "All journeys", filter: (_j: Journey) => true },
  { label: "Awaiting customer action", filter: (j: Journey) => j.status === "Awaiting customer action" },
  { label: "Identity verification failed", filter: (j: Journey) => j.identityOutcome === "Failed" },
  { label: "Existing customers detected", filter: (j: Journey) => j.duplicateOutcome !== "Clear" },
  { label: "Accounts opened but not activated", filter: (j: Journey) => !!j.accountNumber && j.accessMoreStatus !== "Activated" },
  { label: "Artefacts pending synchronisation", filter: (j: Journey) => j.artefactStatus === "Pending synchronisation" || j.artefactStatus === "Failed" },
];

const stages = Array.from(new Set(journeys.map((j) => j.stage)));
const statuses = Array.from(new Set(journeys.map((j) => j.status)));
const departments = Array.from(new Set(journeys.map((j) => j.department)));

export default function OnboardingJourneysPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const savedViewId = useId();
  const [view, setView] = useState(0);
  const [stage, setStage] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  usePageHeader(
    "Onboarding Journeys",
    "Investigate onboarding journeys across the four-stage flow."
  );

  const rows = useMemo(() => {
    return journeys.filter((j) => {
      if (!savedViews[view].filter(j)) return false;
      if (stage && j.stage !== stage) return false;
      if (status && j.status !== status) return false;
      if (department && j.department !== department) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !j.reference.toLowerCase().includes(q) &&
          !j.customerName.toLowerCase().includes(q) &&
          !j.initiatingStaff.toLowerCase().includes(q) &&
          !j.staffId.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [view, stage, status, department, query]);

  const columns: Column<Journey>[] = [
    { key: "reference", header: "Journey reference", render: (j) => <span className="font-medium text-[#101828]">{j.reference}</span> },
    { key: "customer", header: "Customer", render: (j) => <div><p className="text-[#101828]">{j.customerName}</p><p className="text-[11px] text-[#98A2B3]">{j.maskedPhone}</p></div> },
    { key: "staff", header: "Initiating staff", render: (j) => <div><p>{j.initiatingStaff}</p><p className="text-[11px] text-[#98A2B3]">{j.staffId}</p></div> },
    { key: "branch", header: "Branch / dept", render: (j) => <div><p>{j.branch}</p><p className="text-[11px] text-[#98A2B3]">{j.department}</p></div> },
    { key: "stage", header: "Stage", render: (j) => j.stage },
    { key: "status", header: "Status", render: (j) => <StatusBadge status={j.status} /> },
    { key: "artefact", header: "Artefact status", render: (j) => <StatusBadge status={j.artefactStatus} /> },
    { key: "reward", header: "Reward status", render: (j) => <StatusBadge status={j.rewardStatus} /> },
    { key: "updated", header: "Last updated", render: (j) => <span className="text-[#667085]">{j.lastUpdated}</span> },
    { key: "action", header: "Action required", render: (j) => (j.actionRequired === "None" ? <span className="text-[#98A2B3]">—</span> : <span className="text-[#EE7E01] font-medium">{j.actionRequired}</span>) },
    actionsColumn<Journey>((j) => navigate(`/journeys/${j.reference}`), "View"),
  ];

  return (
    <div>
      <Toolbar
        columns={6}
        actions={
          <SecondaryButton
            onClick={() =>
              downloadCsv(
                "onboarding-journeys",
                rows.map((j) => ({
                  reference: j.reference,
                  customer: j.customerName,
                  staff: j.initiatingStaff,
                  branch: j.branch,
                  department: j.department,
                  stage: j.stage,
                  status: j.status,
                  artefactStatus: j.artefactStatus,
                  rewardStatus: j.rewardStatus,
                  lastUpdated: j.lastUpdated,
                  actionRequired: j.actionRequired,
                }))
              )
            }
          >
            <Download size={14} /> Export
          </SecondaryButton>
        }
      >
        <TextFilter value={query} onChange={setQuery} placeholder="Search reference, customer, staff..." className="w-full col-span-2" />
        <div className="flex flex-col gap-1 min-w-0 w-full">
          <label htmlFor={savedViewId} className="text-xs font-medium text-[#344054]">
            Saved view
          </label>
          <select
            id={savedViewId}
            value={view}
            onChange={(e) => setView(Number(e.target.value))}
            className="w-full text-sm rounded-lg border border-gray-200 bg-white px-3 py-2 text-[#344054] focus:outline-none focus:ring-2 focus:ring-[#5584CE]/20 focus:border-[#5584CE]"
          >
            {savedViews.map((v, i) => (
              <option key={v.label} value={i}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <SelectFilter label="Journey stage" value={stage} onChange={setStage} options={stages} className="w-full" />
        <SelectFilter label="Status" value={status} onChange={setStatus} options={statuses} className="w-full" />
        <SelectFilter label="Department" value={department} onChange={setDepartment} options={departments} className="w-full" />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={rows}
        keyField={(j) => j.reference}
        emptyTitle="No onboarding journeys found"
        emptyDescription="No onboarding journeys match the selected filters."
      />
    </div>
  );
}
