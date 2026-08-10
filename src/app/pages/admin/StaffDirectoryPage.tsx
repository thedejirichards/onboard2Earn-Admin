import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { SelectFilter, TextFilter, Toolbar } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { staff } from "@/app/lib/mockData";
import { formatNaira, formatNumber } from "@/app/lib/format";
import type { StaffMember } from "@/app/lib/types";

const departments = Array.from(new Set(staff.map((s) => s.department)));
const branches = Array.from(new Set(staff.map((s) => s.branch)));
const leagues = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

export default function StaffDirectoryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [league, setLeague] = useState("");
  usePageHeader(
    "Staff & Organisation",
    "Employee identity and hierarchy are sourced from the HR system."
  );

  const rows = useMemo(
    () =>
      staff.filter((s) => {
        if (department && s.department !== department) return false;
        if (branch && s.branch !== branch) return false;
        if (league && s.league !== league) return false;
        if (query && !s.name.toLowerCase().includes(query.toLowerCase()) && !s.staffId.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [query, department, branch, league]
  );

  const columns: Column<StaffMember>[] = [
    { key: "name", header: "Employee", render: (s) => <div><p className="text-[#101828] font-medium">{s.name}</p><p className="text-[11px] text-[#98A2B3]">{s.staffId}</p></div> },
    { key: "org", header: "Organisational unit", render: (s) => <div><p>{s.branch}</p><p className="text-[11px] text-[#98A2B3]">{s.department}</p></div> },
    { key: "access", header: "Access", render: (s) => (
      <div className="flex flex-col gap-1 items-start">
        <StatusBadge status={s.standardAccess} />
        {s.elevatedRole && <span className="text-[11px] text-[#5584CE] font-medium">{s.elevatedRole}</span>}
      </div>
    ) },
    { key: "league", header: "League", render: (s) => s.league },
    { key: "points", header: "Points", render: (s) => formatNumber(s.points) },
    { key: "accounts", header: "Accounts opened", render: (s) => s.accountsOpened },
    { key: "activation", header: "Activation rate", render: (s) => `${s.activationRate}%` },
    { key: "deposit", header: "Deposit mobilised", render: (s) => formatNaira(s.depositMobilised) },
    { key: "activity", header: "Last activity", render: (s) => <span className="text-[#667085]">{s.lastActivity}</span> },
    actionsColumn<StaffMember>((s) => navigate(`/staff/${s.staffId}`), "View"),
  ];

  return (
    <div>
      <Toolbar columns={5}>
        <TextFilter value={query} onChange={setQuery} placeholder="Search name or staff ID..." className="w-full col-span-2" />
        <SelectFilter label="Department" value={department} onChange={setDepartment} options={departments} className="w-full" />
        <SelectFilter label="Branch / location" value={branch} onChange={setBranch} options={branches} className="w-full" />
        <SelectFilter label="League" value={league} onChange={setLeague} options={leagues} className="w-full" />
      </Toolbar>

      <DataTable columns={columns} rows={rows} keyField={(s) => s.staffId} />
    </div>
  );
}
