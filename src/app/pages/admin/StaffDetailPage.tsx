import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Flame } from "lucide-react";
import { Panel, SectionCard } from "@/app/components/admin/ui";
import { MetricCard } from "@/app/components/admin/MetricCard";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { journeys, staff } from "@/app/lib/mockData";
import { formatNaira, formatNumber } from "@/app/lib/format";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import type { Journey } from "@/app/lib/types";

export default function StaffDetailPage() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const member = staff.find((s) => s.staffId === staffId);
  const ownJourneys = journeys.filter((j) => j.staffId === staffId);
  usePageHeader(
    member?.name ?? "Staff record not found",
    member ? `${member.staffId} · ${member.branch}` : undefined
  );

  if (!member) {
    return (
      <div>
        <Link to="/staff" className="text-sm text-[#5584CE] flex items-center gap-1 mb-4"><ArrowLeft size={14} /> Back to directory</Link>
        <Panel>Staff record {staffId} was not found in the current scope.</Panel>
      </div>
    );
  }

  const journeyColumns: Column<Journey>[] = [
    { key: "reference", header: "Journey", render: (j) => <span className="font-medium text-[#101828]">{j.reference}</span> },
    { key: "customer", header: "Customer", render: (j) => j.customerName },
    { key: "status", header: "Status", render: (j) => <StatusBadge status={j.status} /> },
    { key: "updated", header: "Last updated", render: (j) => <span className="text-[#667085]">{j.lastUpdated}</span> },
    actionsColumn<Journey>((j) => navigate(`/journeys/${j.reference}`), "View"),
  ];

  return (
    <div>
      <Link to="/staff" className="text-sm text-[#5584CE] flex items-center gap-1 mb-4 hover:underline"><ArrowLeft size={14} /> Back to directory</Link>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Journeys initiated" value={formatNumber(member.journeysInitiated)} />
        <MetricCard label="Accounts created" value={formatNumber(member.accountsOpened)} />
        <MetricCard label="Conversion rate" value={`${member.conversionRate}%`} />
        <MetricCard label="AccessMore activations" value={formatNumber(member.fundedAccounts)} />
        <MetricCard label="First qualifying transactions" value={formatNumber(member.firstTransactions)} />
        <MetricCard label="Tier 3 upgrades" value={formatNumber(member.tier3Upgrades)} />
        <MetricCard label="Deposit mobilised" value={formatNaira(member.depositMobilised)} />
        <MetricCard label="Exceptions attributed" value={formatNumber(member.exceptionsAttributed)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <SectionCard title="Campaign standing">
          <div className="space-y-3 text-sm">
            <Row label="Current campaign" value={member.campaign} />
            <Row label="Current league" value={member.league} />
            <Row label="Current points" value={formatNumber(member.points)} />
            <Row label="Points at risk" value={formatNumber(member.pointsAtRisk)} />
            <Row label="Streak" value={<span className="flex items-center gap-1"><Flame size={13} className="text-[#EE7E01]" />{member.streak} days</span>} />
          </div>
        </SectionCard>
        <SectionCard title="Access">
          <div className="space-y-3 text-sm">
            <Row label="Standard access" value={<StatusBadge status={member.standardAccess} />} />
            <Row label="Elevated portal role" value={member.elevatedRole ?? "None"} />
            <Row label="Employment status" value={<StatusBadge status={member.employmentStatus} />} />
            <Row label="Last Staff Assist activity" value={member.lastActivity} />
          </div>
        </SectionCard>
        <SectionCard title="Attention">
          <div className="space-y-3 text-sm">
            <Row label="Customers requiring attention" value={ownJourneys.filter((j) => j.actionRequired !== "None").length} />
            <Row label="Exceptions attributed" value={member.exceptionsAttributed} />
            <Row label="Unusual activity alerts" value={member.exceptionsAttributed > 3 ? "Review recommended" : "None"} />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Journeys initiated by this employee">
        <DataTable columns={journeyColumns} rows={ownJourneys} keyField={(j) => j.reference} />
      </SectionCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#667085]">{label}</span>
      <span className="text-[#101828] font-medium">{value}</span>
    </div>
  );
}
