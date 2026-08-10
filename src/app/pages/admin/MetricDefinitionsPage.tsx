import { SectionCard } from "@/app/components/admin/ui";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { dmoMetrics } from "@/app/lib/mockData";

const sourceMapping = [
  { info: "Initiating staff, Staff ID and journey reference", source: "Staff Assist", use: "Attribution, journey tracking and employee performance." },
  { info: "Staff organisational hierarchy", source: "Microsoft Active Directory / approved HR source", use: "Access scope, group roll-up and leaderboard grouping." },
  { info: "Account-created status, account number and opening reference", source: "Account-opening service / FLEXCUBE", use: "Account-opened metric and account detail." },
  { info: "Funding status and account balance", source: "FLEXCUBE / approved core-banking data source", use: "Funded accounts, funding rate, deposit mobilisation and average balance." },
  { info: "Transaction status and qualifying transactions", source: "FLEXCUBE, payments platform or approved transaction feed", use: "Transacting-customer and campaign milestone calculations." },
  { info: "AccessMore registration and digital activation", source: "AccessMore", use: "Digital activation and customer milestone tracking." },
  { info: "Consent and account-opening artefacts", source: "Account Opening Portal on Service Central", use: "Evidence, audit retrieval and artefact reconciliation." },
  { info: "Campaign targets, rules and reward schedules", source: "Campaign configuration service / approved campaign owner inputs", use: "Target achievement, leaderboard and reward eligibility." },
  { info: "Calculated metrics and reporting outputs", source: "Staff Assist Reporting Data Mart / DMO analytics layer", use: "Dashboard, historical trends, drill-down and reports." },
];

const joinKeys = [
  "Staff ID", "Journey reference", "Referral or attribution ID", "Customer ID", "Account number",
  "Account-opening reference", "Campaign ID", "Source-channel identifier", "Event date and timestamps",
];

const definitions = [
  { metric: "Accounts Opened", formula: "Unique successfully created accounts attributed within the selected period.", confirm: "Treatment of reopened, duplicate, closed or reversed accounts." },
  { metric: "Deposit Mobilised", formula: "Value attributed to qualifying campaign accounts from the approved core-banking / Treasury source.", confirm: "Whether current balance, closing balance, average balance, gross inflow or net new eligible CASA balance." },
  { metric: "Average Balance per Account", formula: "Approved qualifying balance divided by the agreed account population.", confirm: "Whether the denominator is all opened accounts or only funded accounts, and the averaging period." },
  { metric: "Funded Accounts", formula: "Accounts that meet the approved minimum funding rule within the prescribed period.", confirm: "Minimum amount, timing, qualifying balance and whether reversals remove eligibility." },
  { metric: "Funding Rate", formula: "Funded Accounts ÷ Accounts Opened × 100.", confirm: "Exclusions and treatment of cancelled or invalid accounts." },
  { metric: "Digitally Activated / Transacting Customers", formula: "AccessMore activation and qualifying digital-transaction events sourced from AccessMore / approved transaction feeds.", confirm: "Whether the dashboard shows one combined value or separate Activated and Transacting sub-values." },
  { metric: "Campaign Target Achievement", formula: "Account-count achievement and CASA achievement against approved targets, with any overall weighted score.", confirm: "Target hierarchy, weighting and whether both components must meet a minimum threshold." },
];

export default function MetricDefinitionsPage() {
  usePageHeader(
    "Metric Definitions & Data Lineage",
    "Source mapping and calculation rules behind every metric shown."
  );

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="xl:col-span-2">
          <SectionCard title="Data freshness & confidence" description="Live status per DMO metric.">
            <div className="space-y-2.5">
              {dmoMetrics.map((m) => (
                <div key={m.key} className="flex items-center justify-between rounded-lg border border-gray-100 px-3.5 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-[#101828]">{m.label}</p>
                    <p className="text-[11px] text-[#98A2B3]">{m.source} · refreshed {m.refreshedAt}</p>
                  </div>
                  <StatusBadge status={m.completeness} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
        <SectionCard title="Required join keys">
          <div className="flex flex-wrap gap-1.5">
            {joinKeys.map((k) => (
              <span key={k} className="text-xs rounded-md bg-[#5584CE]/5 text-[#5584CE] px-2.5 py-1 font-medium">{k}</span>
            ))}
          </div>
          <p className="text-[11px] text-[#98A2B3] mt-4">
            Authoritative commercial, financial and digital-performance values are obtained from source systems and
            curated for reporting — never manually maintained inside the Admin Portal.
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Authoritative source mapping" description="Section 9 of the design brief.">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-[#667085] uppercase tracking-wide py-2.5 pr-4">Information</th>
                <th className="text-left text-xs font-medium text-[#667085] uppercase tracking-wide py-2.5 pr-4">Authoritative source</th>
                <th className="text-left text-xs font-medium text-[#667085] uppercase tracking-wide py-2.5">Portal use</th>
              </tr>
            </thead>
            <tbody>
              {sourceMapping.map((row) => (
                <tr key={row.info} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-4 text-[#101828] font-medium align-top">{row.info}</td>
                  <td className="py-2.5 pr-4 text-[#344054] align-top">{row.source}</td>
                  <td className="py-2.5 text-[#667085] align-top">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="h-5" />

      <SectionCard title="Metric definitions & calculation rules" description="Pending final business confirmation on the items in the right-hand column.">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-[#667085] uppercase tracking-wide py-2.5 pr-4">Metric</th>
                <th className="text-left text-xs font-medium text-[#667085] uppercase tracking-wide py-2.5 pr-4">Design definition / formula</th>
                <th className="text-left text-xs font-medium text-[#667085] uppercase tracking-wide py-2.5">Business confirmation required</th>
              </tr>
            </thead>
            <tbody>
              {definitions.map((row) => (
                <tr key={row.metric} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-4 text-[#101828] font-medium align-top whitespace-nowrap">{row.metric}</td>
                  <td className="py-2.5 pr-4 text-[#344054] align-top">{row.formula}</td>
                  <td className="py-2.5 text-[#EE7E01] align-top">{row.confirm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
