import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Panel, PrimaryButton, SectionCard } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { accessUsers } from "@/app/lib/mockData";
import { roleDescriptions, roles } from "@/app/lib/nav";
import type { AccessUser } from "@/app/lib/types";

export default function AccessManagementPage() {
  const navigate = useNavigate();
  const [showMatrix, setShowMatrix] = useState(false);
  usePageHeader(
    "Access Management",
    "Manage elevated Admin Portal roles, approval and periodic review."
  );

  const columns: Column<AccessUser>[] = [
    { key: "name", header: "User", render: (u) => <div><p className="font-medium text-[#101828]">{u.name}</p><p className="text-[11px] text-[#98A2B3]">{u.staffId}</p></div> },
    { key: "roles", header: "Current roles", render: (u) => (u.currentRoles.length ? u.currentRoles.join(", ") : <span className="text-[#98A2B3]">Standard access only</span>) },
    { key: "scope", header: "Organisational scope", render: (u) => u.orgScope },
    { key: "request", header: "Role-request status", render: (u) => <StatusBadge status={u.requestStatus === "None" ? "Not started" : u.requestStatus} /> },
    { key: "effective", header: "Effective date", render: (u) => u.effectiveDate },
    { key: "expiry", header: "Expiry date", render: (u) => u.expiryDate ?? "—" },
    { key: "login", header: "Last login", render: (u) => u.lastLogin },
    { key: "status", header: "Account status", render: (u) => <StatusBadge status={u.accountStatus} /> },
    actionsColumn<AccessUser>((u) => navigate(`/staff/${u.staffId}`), "View"),
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PrimaryButton><Plus size={14} /> Assign role</PrimaryButton>
      </div>

      <SectionCard
        title="Role matrix"
        description="Read-only summary of what each role can view, create, configure, export, approve, retry and resolve."
        actions={
          <button onClick={() => setShowMatrix((v) => !v)} className="text-xs font-medium text-[#5584CE] flex items-center gap-1">
            {showMatrix ? <ChevronDown size={14} /> : <ChevronRight size={14} />} {showMatrix ? "Hide" : "Show"} matrix
          </button>
        }
      >
        {showMatrix && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {roles.map((r) => (
              <Panel key={r} padded className="!p-3.5">
                <p className="text-xs font-semibold text-[#101828] mb-1.5">{r}</p>
                <p className="text-[11px] text-emerald-700 mb-1"><span className="font-medium">Can:</span> {roleDescriptions[r].can}</p>
                <p className="text-[11px] text-red-600"><span className="font-medium">Cannot:</span> {roleDescriptions[r].cannot}</p>
              </Panel>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="h-5" />

      <DataTable columns={columns} rows={accessUsers} keyField={(u) => u.staffId} />

      <p className="text-[11px] text-[#98A2B3] mt-4">
        Access is automatically removed following staff exit or NT disablement, subject to immediate revocation,
        periodic review, dormant elevated-access review and temporary-role expiry. Every access change is logged.
      </p>
    </div>
  );
}
