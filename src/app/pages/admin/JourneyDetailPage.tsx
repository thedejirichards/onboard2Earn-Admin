import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Check, RefreshCw, Send, UserPlus } from "lucide-react";
import { Panel, PrimaryButton, SecondaryButton } from "@/app/components/admin/ui";
import StatusBadge from "@/app/components/admin/StatusBadge";
import AssignOwnerModal from "@/app/components/admin/AssignOwnerModal";
import { useToast } from "@/app/components/admin/Toast";
import { artefacts, auditLogs, journeys } from "@/app/lib/mockData";

const tabs = ["Overview", "Customer Actions", "Identity and Checks", "Account and Artefacts", "Activation and Rewards", "Audit Trail"] as const;

const timelineStages = ["Account & Consent", "Customer Action", "Identity Verification", "Review & Create Account"];

export default function JourneyDetailPage() {
  const { reference } = useParams();
  const showToast = useToast();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [owner, setOwner] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const journey = journeys.find((j) => j.reference === reference);
  const artefact = artefacts.find((a) => a.journeyReference === reference);
  const relatedAudit = useMemo(
    () => auditLogs.filter((a) => a.recordAffected === reference).concat(auditLogs.slice(0, 3)),
    [reference]
  );

  if (!journey) {
    return (
      <div>
        <Link to="/journeys" className="text-sm text-[#5584CE] flex items-center gap-1 mb-4">
          <ArrowLeft size={14} /> Back to journeys
        </Link>
        <Panel>Journey {reference} was not found in the current scope.</Panel>
      </div>
    );
  }

  const ageDays = Math.max(1, Math.round((new Date("2026-08-10").getTime() - new Date(journey.dateInitiated).getTime()) / 86_400_000));
  const stageIndex = timelineStages.indexOf(journey.stage);

  return (
    <div>
      <Link to="/journeys" className="text-sm text-[#5584CE] flex items-center gap-1 mb-4 hover:underline">
        <ArrowLeft size={14} /> Back to journeys
      </Link>

      <Panel className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-lg font-semibold text-[#101828]">{journey.reference}</h1>
              <StatusBadge status={journey.status} />
            </div>
            <p className="text-sm text-[#667085]">{journey.customerName} · {journey.accountType}</p>
          </div>
          <div className="flex items-center gap-2">
            <SecondaryButton
              onClick={() => showToast(`Consent link resent to ${journey.maskedPhone}.`)}
            >
              <Send size={14} /> Resend consent link
            </SecondaryButton>
            <SecondaryButton
              onClick={() => showToast(`Technical activity retried for ${journey.reference}.`)}
            >
              <RefreshCw size={14} /> Retry technical activity
            </SecondaryButton>
            <PrimaryButton onClick={() => setAssignOpen(true)}><UserPlus size={14} /> Assign owner</PrimaryButton>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-6">
          <div><p className="text-[#98A2B3] mb-1">Account number</p><p className="text-[#101828] font-medium">{journey.accountNumber ?? "Not yet created"}</p></div>
          <div><p className="text-[#98A2B3] mb-1">Initiating employee</p><p className="text-[#101828] font-medium">{journey.initiatingStaff} ({journey.staffId})</p></div>
          <div><p className="text-[#98A2B3] mb-1">Date initiated</p><p className="text-[#101828] font-medium">{journey.dateInitiated}</p></div>
          <div><p className="text-[#98A2B3] mb-1">Journey age</p><p className="text-[#101828] font-medium">{ageDays} day{ageDays === 1 ? "" : "s"}</p></div>
          <div><p className="text-[#98A2B3] mb-1">Last updated</p><p className="text-[#101828] font-medium">{journey.lastUpdated}</p></div>
          <div><p className="text-[#98A2B3] mb-1">Branch / department</p><p className="text-[#101828] font-medium">{journey.branch} · {journey.department}</p></div>
          <div><p className="text-[#98A2B3] mb-1">Case owner</p><p className="text-[#101828] font-medium">{owner ?? "Unassigned"}</p></div>
          <div className="col-span-2"><p className="text-[#98A2B3] mb-1">Action required</p><p className={`font-medium ${journey.actionRequired === "None" ? "text-[#98A2B3]" : "text-[#EE7E01]"}`}>{journey.actionRequired}</p></div>
        </div>

        {/* Visual journey timeline */}
        <div className="flex items-center">
          {timelineStages.map((s, i) => (
            <div key={s} className="flex-1 flex items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    i < stageIndex ? "bg-emerald-500 text-white" : i === stageIndex ? "bg-[#5584CE] text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < stageIndex ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-[11px] text-center max-w-[100px] ${i <= stageIndex ? "text-[#344054] font-medium" : "text-[#98A2B3]"}`}>{s}</span>
              </div>
              {i < timelineStages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < stageIndex ? "bg-emerald-500" : "bg-gray-100"}`} />
              )}
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? "border-[#5584CE] text-[#5584CE]" : "border-transparent text-[#667085] hover:text-[#344054]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <Panel>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm">
            <Field label="Masked phone number" value={journey.maskedPhone} />
            <Field label="Masked email address" value={journey.maskedEmail} />
            <Field label="Account type" value={journey.accountType} />
            <Field label="Current stage" value={journey.stage} />
            <Field label="Duplicate / existing-customer outcome" value={journey.duplicateOutcome} />
            <Field label="Reward status" value={<StatusBadge status={journey.rewardStatus} />} />
          </dl>
        </Panel>
      )}

      {tab === "Customer Actions" && (
        <Panel>
          <p className="text-sm font-medium text-[#101828] mb-4">
            {journey.status === "Awaiting customer action" ? "Awaiting customer requirements" : "Customer requirements completed"}
          </p>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm">
            <Field label="Link delivery" value={<StatusBadge status={journey.status === "Awaiting customer action" ? "Delivered" : "Completed"} />} />
            <Field label="Terms acceptance" value={journey.status === "Awaiting customer action" ? "Pending" : "Accepted"} />
            <Field label="Privacy consent" value={journey.status === "Awaiting customer action" ? "Pending" : "Accepted"} />
            <Field label="Content version" value="Terms & Conditions v5.2 · Privacy Notice v4.1" />
            <Field label="Customer-action reference" value={`CA-${journey.reference.slice(-8)}`} />
            <Field label="Submission timestamp" value={journey.status === "Awaiting customer action" ? "—" : journey.dateInitiated} />
          </dl>
        </Panel>
      )}

      {tab === "Identity and Checks" && (
        <Panel>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm">
            <Field label="BVN outcome" value={journey.identityOutcome} />
            <Field label="NIN / date-of-birth outcome" value={journey.identityOutcome} />
            <Field label="Facial & liveness outcome" value={journey.identityOutcome === "Failed" ? "Failed" : "Passed"} />
            <Field label="AML outcome" value={<StatusBadge status={journey.amlOutcome} />} />
            <Field label="Duplicate-account outcome" value={<StatusBadge status={journey.duplicateOutcome} />} />
            <Field label="Eligibility outcome" value={journey.status === "Additional review required" ? "Referred for review" : "Clear"} />
          </dl>
          <p className="text-xs text-[#98A2B3] mt-5 border-t border-gray-100 pt-4">
            Sensitive AML and identity information is restricted by role. Verified customer identity information is read-only in this portal.
          </p>
        </Panel>
      )}

      {tab === "Account and Artefacts" && (
        <Panel>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm mb-6">
            <Field label="Account-opening status" value={journey.accountNumber ? "Account created" : "Not yet created"} />
            <Field label="Account number" value={journey.accountNumber ?? "—"} />
            <Field label="Product" value={journey.accountType} />
            <Field label="Date opened" value={journey.accountNumber ? journey.dateInitiated : "—"} />
            <Field label="Repository status" value={<StatusBadge status={journey.artefactStatus} />} />
            <Field label="Repository reference" value={artefact?.repositoryReference ?? "—"} />
          </dl>
          {artefact && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-[#344054] mb-2">
                Artefacts: {artefact.storedArtefacts} of {artefact.expectedArtefacts} stored · retry count {artefact.retryCount}
              </p>
              {artefact.lastError && <p className="text-xs text-red-600">Last error: {artefact.lastError}</p>}
              <p className="text-xs text-[#98A2B3] mt-2">Artefacts are read-only after submission. A retry will not recreate the account or duplicate artefact records.</p>
            </div>
          )}
        </Panel>
      )}

      {tab === "Activation and Rewards" && (
        <Panel>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm">
            <Field label="AccessMore registration" value={journey.accessMoreStatus} />
            <Field label="Activation date" value={journey.accessMoreStatus === "Activated" ? journey.lastUpdated : "—"} />
            <Field label="First qualifying transaction" value={journey.firstTransactionStatus} />
            <Field label="Tier 3 upgrade" value={journey.firstTransactionStatus === "Completed" ? "Upgraded" : "Not yet"} />
            <Field label="Employee reward status" value={<StatusBadge status={journey.rewardStatus} />} />
            <Field label="Customer reward status" value="Not applicable — DiamondXtra Customer Rewards are administered separately" />
          </dl>
        </Panel>
      )}

      {tab === "Audit Trail" && (
        <Panel padded={false}>
          <div className="divide-y divide-gray-50">
            {relatedAudit.map((a) => (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#5584CE] mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#344054]">
                    <span className="font-medium text-[#101828]">{a.user}</span> — {a.action.toLowerCase()}
                  </p>
                  <p className="text-xs text-[#98A2B3]">{a.dateTime} · {a.role}</p>
                </div>
                <StatusBadge status={a.outcome} />
              </div>
            ))}
          </div>
        </Panel>
      )}

      <AssignOwnerModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={`Assign owner — ${journey.reference}`}
        subtitle={journey.customerName}
        currentOwner={owner}
        onAssign={(newOwner) => {
          setOwner(newOwner);
          showToast(`${journey.reference} assigned to ${newOwner}.`);
        }}
      />
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
