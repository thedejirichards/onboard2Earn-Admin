import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { Panel, SectionCard, SelectFilter } from "@/app/components/admin/ui";
import { MetricCard } from "@/app/components/admin/MetricCard";
import { FunnelChart, HorizontalBarList, Sparkline } from "@/app/components/admin/charts";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { useAdmin } from "@/app/lib/AdminContext";
import {
  artefacts, attentionPanel, campaigns, conversionFunnel, journeys, leaderboard,
  performanceBreakdown, staff, trends,
} from "@/app/lib/mockData";
import { formatNumber } from "@/app/lib/format";

const departments = Array.from(new Set(journeys.map((j) => j.department)));
const accountTypes = Array.from(new Set(journeys.map((j) => j.accountType)));
const branches = Array.from(new Set(journeys.map((j) => j.branch)));
const dateRangeOptions = ["Today", "Last 7 days", "Last 30 days", "This quarter", "Custom range"];

export default function GeneralOverviewTab() {
  const navigate = useNavigate();
  const { dateRange, setDateRange } = useAdmin();
  const [department, setDepartment] = useState("");
  const [accountType, setAccountType] = useState("");
  const [branch, setBranch] = useState("");

  const filtered = useMemo(
    () =>
      journeys.filter(
        (j) =>
          (!department || j.department === department) &&
          (!accountType || j.accountType === accountType) &&
          (!branch || j.branch === branch)
      ),
    [department, accountType, branch]
  );

  const initiated = filtered.length;
  const requirementsCompleted = filtered.filter((j) => !["Draft", "Link sent", "Awaiting customer action"].includes(j.status)).length;
  const identityVerified = filtered.filter((j) => j.identityOutcome === "Passed").length;
  const accountsOpened = filtered.filter((j) => j.accountNumber).length;
  const activations = filtered.filter((j) => j.accessMoreStatus === "Activated").length;
  const firstTxns = filtered.filter((j) => j.firstTransactionStatus === "Completed").length;
  const journeysNeedingAttention = filtered.filter((j) => j.actionRequired !== "None").length;
  const artefactFailures = artefacts.filter((a) => a.status === "Failed").length;
  const activeCampaign = campaigns.find((c) => c.status === "Active");
  const activeStaffCount = staff.filter((s) => s.employmentStatus === "Active").length;

  const commercialFunnel = [
    { label: "Journeys initiated", value: initiated },
    { label: "Accounts opened", value: accountsOpened },
    { label: "Accounts funded", value: Math.round(accountsOpened * 0.81) },
    { label: "AccessMore activated", value: activations },
    { label: "Customers digitally transacting", value: firstTxns },
  ];

  return (
    <>
      <Panel className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SelectFilter label="Department" value={department} onChange={setDepartment} options={departments} className="w-full" />
          <SelectFilter label="Account type" value={accountType} onChange={setAccountType} options={accountTypes} className="w-full" />
          <SelectFilter label="Branch / location" value={branch} onChange={setBranch} options={branches} className="w-full" />
          <SelectFilter label="Date range" value={dateRange} onChange={setDateRange} options={dateRangeOptions} className="w-full" />
        </div>
        {(department || accountType || branch) && (
          <button
            onClick={() => {
              setDepartment("");
              setAccountType("");
              setBranch("");
            }}
            className="text-xs text-[#5584CE] font-medium hover:underline mt-3"
          >
            Clear filters
          </button>
        )}
      </Panel>

      {/* Operational onboarding metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Journeys initiated" value={formatNumber(initiated)} delta={12} />
        <MetricCard label="Requirements completed" value={formatNumber(requirementsCompleted)} delta={8} />
        <MetricCard label="Identity verifications completed" value={formatNumber(identityVerified)} delta={6} />
        <MetricCard label="Accounts successfully opened" value={formatNumber(accountsOpened)} delta={9} />
        <MetricCard
          label="Account-opening conversion"
          value={`${initiated ? Math.round((accountsOpened / initiated) * 100) : 0}%`}
          delta={3}
        />
        <MetricCard label="AccessMore activations" value={formatNumber(activations)} delta={11} />
        <MetricCard label="First qualifying transactions" value={formatNumber(firstTxns)} delta={-2} />
        <MetricCard label="Employees active this period" value={`${activeStaffCount} / ${staff.length}`} delta={1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <SectionCard title="Conversion funnel" description="Journey initiated through to Tier 3 upgrade completed.">
            <FunnelChart steps={conversionFunnel} />
          </SectionCard>
        </div>
        <SectionCard title="Commercial performance funnel" description="Connects onboarding activity to commercial value.">
          <HorizontalBarList items={commercialFunnel.map((c) => ({ name: c.label, volume: c.value }))} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <SectionCard title="Trends" description="Daily activity over the last 14 days.">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-[#667085] mb-1">Journeys initiated</p>
              <Sparkline data={trends.journeysInitiated} />
            </div>
            <div>
              <p className="text-xs text-[#667085] mb-1">Accounts opened</p>
              <Sparkline data={trends.accountsOpened} color="#EE7E01" />
            </div>
            <div>
              <p className="text-xs text-[#667085] mb-1">AccessMore activations</p>
              <Sparkline data={trends.accessMoreActivations} color="#16A34A" />
            </div>
            <div>
              <p className="text-xs text-[#667085] mb-1">Staff participation</p>
              <Sparkline data={trends.staffParticipation} color="#7C3AED" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Performance breakdown" description="Volume alongside rate, so large units aren't rewarded for volume alone.">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-medium text-[#344054] mb-2">Top-performing branches</p>
              <HorizontalBarList items={performanceBreakdown.topBranches} />
            </div>
            <div>
              <p className="text-xs font-medium text-[#344054] mb-2">Lowest-converting groups</p>
              <HorizontalBarList items={performanceBreakdown.lowestConverting} color="#DC2626" />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <SectionCard
            title="Attention & exceptions"
            description="Cases requiring operational, compliance or technical follow-up."
            actions={
              <button onClick={() => navigate("/exceptions")} className="text-xs font-medium text-[#5584CE] hover:underline flex items-center gap-1">
                View all exceptions <ArrowRight size={12} />
              </button>
            }
          >
            <div className="grid grid-cols-2 gap-3">
              {attentionPanel.map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.link)}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3.5 py-3 text-left hover:border-[#5584CE]/30 hover:bg-[#5584CE]/[0.02] transition-colors"
                >
                  <span className="text-xs text-[#344054] pr-2">{a.label}</span>
                  <span
                    className={`text-sm font-semibold shrink-0 ${a.count > 0 ? "text-[#EE7E01]" : "text-[#98A2B3]"}`}
                  >
                    {a.count}
                  </span>
                </button>
              ))}
              <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3.5 py-3">
                <span className="text-xs text-[#344054] pr-2">Journeys requiring attention (filtered scope)</span>
                <span className="text-sm font-semibold text-[#EE7E01]">{journeysNeedingAttention}</span>
              </div>
              <button
                onClick={() => navigate("/artefacts")}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3.5 py-3 text-left hover:border-[#5584CE]/30 hover:bg-[#5584CE]/[0.02] transition-colors"
              >
                <span className="text-xs text-[#344054] pr-2">Artefact-synchronisation failures</span>
                <span className={`text-sm font-semibold shrink-0 ${artefactFailures > 0 ? "text-red-600" : "text-[#98A2B3]"}`}>
                  {artefactFailures}
                </span>
              </button>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Campaign summary"
          description={activeCampaign?.name}
          actions={
            <button onClick={() => navigate("/leaderboard")} className="text-xs font-medium text-[#5584CE] hover:underline flex items-center gap-1">
              Leaderboard <ArrowRight size={12} />
            </button>
          }
        >
          {activeCampaign && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <Panel padded className="!p-3">
                  <p className="text-[#98A2B3] mb-1">Participants</p>
                  <p className="text-base font-semibold text-[#101828]">{formatNumber(activeCampaign.participants)}</p>
                </Panel>
                <Panel padded className="!p-3">
                  <p className="text-[#98A2B3] mb-1">Points issued</p>
                  <p className="text-base font-semibold text-[#101828]">{formatNumber(activeCampaign.pointsIssued)}</p>
                </Panel>
              </div>
              <StatusBadge status={activeCampaign.rewardStatus} />
            </div>
          )}
          <p className="text-xs font-medium text-[#344054] mb-2">Top 5 this period</p>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((e) => (
              <div key={e.staffId} className="flex items-center gap-2.5 text-xs">
                <span className="w-4 text-[#98A2B3] font-medium">{e.rank}</span>
                <span className="flex-1 text-[#344054] font-medium truncate">{e.name}</span>
                <span className="text-[#98A2B3] tabular-nums">{formatNumber(e.points)} pts</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
