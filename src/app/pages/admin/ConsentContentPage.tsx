import { useState } from "react";
import { Eye, History, Plus } from "lucide-react";
import { Pill, PrimaryButton, SecondaryButton } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import Modal, { FormField, inputClass } from "@/app/components/admin/Modal";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { useToast } from "@/app/components/admin/Toast";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { contentItems as initialContentItems } from "@/app/lib/mockData";
import type { ContentItem } from "@/app/lib/types";

const categories = Array.from(new Set(initialContentItems.map((c) => c.category)));

export default function ConsentContentPage() {
  const showToast = useToast();
  const [contentItems, setContentItems] = useState(initialContentItems);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [newDraftOpen, setNewDraftOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState(categories[0]);
  usePageHeader(
    "Consent & Attestation Content",
    "Manage the customer consent and attestation form content."
  );

  function updateSelected(patch: Partial<ContentItem>) {
    if (!selected) return;
    const updated = { ...selected, ...patch };
    setSelected(updated);
    setContentItems((prev) => prev.map((c) => (c.id === selected.id ? updated : c)));
  }

  const columns: Column<ContentItem>[] = [
    { key: "name", header: "Content item", render: (c) => <div><p className="font-medium text-[#101828]">{c.name}</p><p className="text-[11px] text-[#98A2B3]">{c.category}</p></div> },
    { key: "version", header: "Version", render: (c) => c.version },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "updated", header: "Last updated", render: (c) => c.lastUpdated },
    { key: "by", header: "Updated by", render: (c) => c.updatedBy },
    actionsColumn<ContentItem>(setSelected, "View"),
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PrimaryButton
          onClick={() => {
            setDraftName("");
            setDraftCategory(categories[0]);
            setNewDraftOpen(true);
          }}
        >
          <Plus size={14} /> New draft version
        </PrimaryButton>
      </div>

      <DataTable columns={columns} rows={contentItems} keyField={(c) => c.id} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} subtitle={selected?.category}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge status={selected.status} />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Version" value={selected.version} />
              <Field label="Last updated" value={selected.lastUpdated} />
              <Field label="Updated by" value={selected.updatedBy} />
              <Field label="Mandatory" value="Yes" />
            </dl>
            <CustomerFormPreview item={selected} />
            <div className="flex flex-wrap gap-2">
              <SecondaryButton onClick={() => setPreviewOpen(true)}><Eye size={14} /> Preview journey</SecondaryButton>
              <SecondaryButton onClick={() => setHistoryOpen(true)}><History size={14} /> Version history</SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  if (selected.status !== "Draft") {
                    showToast(`${selected.name} is already ${selected.status.toLowerCase()}.`);
                    return;
                  }
                  updateSelected({ status: "Pending approval" });
                  showToast(`${selected.name} ${selected.version} submitted for approval.`);
                }}
              >
                Submit for approval
              </PrimaryButton>
            </div>
            <p className="text-[11px] text-[#98A2B3] border-t border-gray-100 pt-3">
              No answer is preselected. Legal acceptance uses checkboxes; Yes/No declarations use radio buttons. Every
              change is auditable and previously completed submissions never change when a new version publishes.
            </p>
          </div>
        )}
      </Drawer>

      {selected && (
        <Modal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title="Full journey preview"
          subtitle={`${selected.name} in context of the customer journey`}
        >
          <CustomerFormPreview item={selected} />
        </Modal>
      )}

      {selected && (
        <Modal
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          title="Version history"
          subtitle={selected.name}
        >
          <div className="space-y-2">
            {versionHistoryFor(selected).map((v) => (
              <div key={v.version} className="flex items-center justify-between text-sm rounded-lg border border-gray-100 px-3 py-2.5">
                <div>
                  <p className="text-[#101828] font-medium">{v.version}</p>
                  <p className="text-[11px] text-[#98A2B3]">{v.updatedBy} · {v.lastUpdated}</p>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </Modal>
      )}

      <Modal
        open={newDraftOpen}
        onClose={() => setNewDraftOpen(false)}
        title="New draft version"
        subtitle="Start a new draft version of a consent or attestation item"
        footer={
          <>
            <SecondaryButton onClick={() => setNewDraftOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                if (!draftName.trim()) return;
                const id = `CNT-${String(contentItems.length + 1).padStart(2, "0")}`;
                const newItem: ContentItem = {
                  id,
                  category: draftCategory,
                  name: draftName.trim(),
                  version: "v1.0",
                  status: "Draft",
                  lastUpdated: "Today",
                  updatedBy: "Deji Richards",
                };
                setContentItems((prev) => [newItem, ...prev]);
                showToast(`${newItem.name} created as a new draft (${newItem.version}).`);
                setNewDraftOpen(false);
              }}
            >
              Create draft
            </PrimaryButton>
          </>
        }
      >
        <FormField label="Content item name">
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="e.g. Source-of-Wealth Declaration"
            className={inputClass}
          />
        </FormField>
        <FormField label="Category">
          <select value={draftCategory} onChange={(e) => setDraftCategory(e.target.value)} className={inputClass}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
      </Modal>
    </div>
  );
}

function versionHistoryFor(item: ContentItem): { version: string; status: ContentItem["status"]; lastUpdated: string; updatedBy: string }[] {
  const [major] = item.version.replace("v", "").split(".").map(Number);
  const history = [];
  for (let m = major; m >= 1; m--) {
    history.push({
      version: `v${m}.0`,
      status: m === major ? item.status : ("Archived" as ContentItem["status"]),
      lastUpdated: m === major ? item.lastUpdated : `${(major - m) * 45} days before that`,
      updatedBy: m === major ? item.updatedBy : "Legal & Compliance",
    });
  }
  return history;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-[#98A2B3] mb-1">{label}</dt>
      <dd className="text-[#101828] font-medium">{value}</dd>
    </div>
  );
}

type FormConfig =
  | { kind: "yesno"; question: string; helper?: string; followUpLabel: string; followUpPlaceholder: string }
  | { kind: "select"; question: string; helper?: string; options: string[]; confirmLabel: string }
  | { kind: "legal"; heading: string; body: string; checkboxLabel: string }
  | { kind: "summary" };

const formConfigByCategory: Record<string, FormConfig> = {
  "Cryptocurrency attestation": {
    kind: "yesno",
    question: "Have you received funds from the sale or exchange of cryptocurrency in the last 12 months?",
    helper: "This includes Bitcoin, Ethereum and any other digital or virtual currency.",
    followUpLabel: "Please describe the source of these funds",
    followUpPlaceholder: "e.g. Sale of Bitcoin held since 2021, via Luno",
  },
  "PEP declaration": {
    kind: "yesno",
    question: "Are you, or an immediate family member or close associate, a Politically Exposed Person (PEP)?",
    helper: "A PEP is someone who holds, or has held, a prominent public function.",
    followUpLabel: "Please provide the position held and the country",
    followUpPlaceholder: "e.g. Municipal councillor, South Africa",
  },
  "FEP declaration": {
    kind: "yesno",
    question: "Are you a Foreign Exposed Person (FEP) — a prominent public official of a foreign country?",
    followUpLabel: "Please provide the position held and the country",
    followUpPlaceholder: "e.g. Trade attaché, Kenyan embassy",
  },
  "Country of residence": {
    kind: "select",
    question: "What is your country of residence?",
    helper: "This should match the residential address on your application.",
    options: ["South Africa", "Namibia", "Botswana", "Zimbabwe", "Other"],
    confirmLabel: "This matches my registered residential address",
  },
  "Terms and Conditions": {
    kind: "legal",
    heading: "Account Opening Terms and Conditions",
    body: "By opening this account, you agree to be bound by the Account Opening Terms and Conditions, including the fees, interest rates and account usage rules set out therein.",
    checkboxLabel: "I have read and agree to the Account Opening Terms and Conditions",
  },
  "Privacy Notice": {
    kind: "legal",
    heading: "Privacy Notice and Consent",
    body: "We collect and process your personal information to open and administer your account, verify your identity, and meet our legal and regulatory obligations.",
    checkboxLabel: "I have read and understood the Privacy Notice",
  },
  "Final confirmation": { kind: "summary" },
};

const summaryAnswers: { label: string; value: string }[] = [
  { label: "Cryptocurrency source-of-funds", value: "No" },
  { label: "Politically Exposed Person", value: "No" },
  { label: "Foreign Exposed Person", value: "No" },
  { label: "Country of residence", value: "South Africa" },
  { label: "Terms and Conditions", value: "Agreed" },
  { label: "Privacy Notice", value: "Agreed" },
];

const formTypeLabel: Record<FormConfig["kind"], string> = {
  yesno: "Yes/No question",
  select: "Select question",
  legal: "Checkbox (legal consent)",
  summary: "Review & submit",
};

function CustomerFormPreview({ item }: { item: ContentItem }) {
  const [yesNo, setYesNo] = useState<"Yes" | "No" | null>(null);
  const [followUp, setFollowUp] = useState("");
  const [country, setCountry] = useState("");
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);

  const config = formConfigByCategory[item.category] ?? formConfigByCategory["Terms and Conditions"];

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-4">
      <Pill>{formTypeLabel[config.kind]}</Pill>

      {config.kind === "yesno" && (
        <>
          <div>
            <p className="text-sm font-medium text-[#101828] leading-snug">{config.question}</p>
            {config.helper && <p className="text-xs text-[#667085] mt-1">{config.helper}</p>}
          </div>
          <div className="space-y-2">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-[#5584CE] has-[:checked]:bg-[#5584CE]/5">
                <input
                  type="radio"
                  name={`yesno-${item.id}`}
                  checked={yesNo === opt}
                  onChange={() => setYesNo(opt)}
                  className="accent-[#5584CE]"
                />
                {opt}
              </label>
            ))}
          </div>
          {yesNo === "Yes" && (
            <div>
              <label className="text-xs font-medium text-[#344054] mb-1 block">{config.followUpLabel}</label>
              <textarea
                rows={2}
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder={config.followUpPlaceholder}
                className="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5584CE]/20 resize-none"
              />
            </div>
          )}
        </>
      )}

      {config.kind === "select" && (
        <>
          <div>
            <p className="text-sm font-medium text-[#101828] leading-snug">{config.question}</p>
            {config.helper && <p className="text-xs text-[#667085] mt-1">{config.helper}</p>}
          </div>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5584CE]/20 bg-white"
          >
            <option value="">Select a country...</option>
            {config.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <label className="flex items-start gap-2 text-xs text-[#344054]">
            <input
              type="checkbox"
              checked={addressConfirmed}
              onChange={(e) => setAddressConfirmed(e.target.checked)}
              className="mt-0.5 accent-[#5584CE]"
            />
            {config.confirmLabel}
          </label>
        </>
      )}

      {config.kind === "legal" && (
        <>
          <p className="text-sm font-medium text-[#101828]">{config.heading}</p>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-[#667085] max-h-24 overflow-y-auto">
            {config.body}
          </div>
          <label className="flex items-start gap-2 text-xs text-[#344054]">
            <input
              type="checkbox"
              checked={legalAccepted}
              onChange={(e) => setLegalAccepted(e.target.checked)}
              className="mt-0.5 accent-[#5584CE]"
            />
            {config.checkboxLabel}
          </label>
        </>
      )}

      {config.kind === "summary" && (
        <>
          <p className="text-sm font-medium text-[#101828]">Review your answers</p>
          <dl className="space-y-2">
            {summaryAnswers.map((a) => (
              <div key={a.label} className="flex items-center justify-between text-xs border-b border-gray-100 pb-2">
                <dt className="text-[#667085]">{a.label}</dt>
                <dd className="text-[#101828] font-medium">{a.value}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <button
        disabled
        className="w-full rounded-lg bg-[#EE7E01]/40 text-white text-sm font-medium px-3.5 py-2 cursor-not-allowed"
      >
        {config.kind === "summary" ? "Confirm and submit" : "Continue"}
      </button>
    </div>
  );
}
