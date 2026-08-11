import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import Drawer from "@/app/components/admin/Drawer";
import Modal, { FormField, inputClass } from "@/app/components/admin/Modal";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { useToast } from "@/app/components/admin/Toast";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { communications as initialCommunications } from "@/app/lib/mockData";
import { formatNumber } from "@/app/lib/format";
import type { CommunicationTemplate } from "@/app/lib/types";

export default function CommunicationsPage() {
  const showToast = useToast();
  const [communications, setCommunications] = useState(initialCommunications);
  const [selected, setSelected] = useState<CommunicationTemplate | null>(null);
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateChannel, setTemplateChannel] = useState<CommunicationTemplate["channel"]>("Email");
  usePageHeader(
    "Communications",
    "Consent invitations, reminders and milestone notifications."
  );

  function updateSelected(patch: Partial<CommunicationTemplate>) {
    if (!selected) return;
    const updated = { ...selected, ...patch };
    setSelected(updated);
    setCommunications((prev) => prev.map((c) => (c.id === selected.id ? updated : c)));
  }

  const columns: Column<CommunicationTemplate>[] = [
    { key: "name", header: "Template", render: (c) => <span className="font-medium text-[#101828]">{c.name}</span> },
    { key: "channel", header: "Channel", render: (c) => c.channel },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "sent", header: "Sent", render: (c) => formatNumber(c.sent) },
    { key: "delivered", header: "Delivered", render: (c) => formatNumber(c.delivered) },
    { key: "failed", header: "Failed", render: (c) => formatNumber(c.failed) },
    { key: "opened", header: "Opened", render: (c) => (c.opened ? formatNumber(c.opened) : "—") },
    { key: "updated", header: "Last updated", render: (c) => c.lastUpdated },
    actionsColumn<CommunicationTemplate>(setSelected, "View"),
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PrimaryButton
          onClick={() => {
            setTemplateName("");
            setTemplateChannel("Email");
            setNewTemplateOpen(true);
          }}
        >
          <Plus size={14} /> New template
        </PrimaryButton>
      </div>

      <DataTable columns={columns} rows={communications} keyField={(c) => c.id} />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} subtitle={selected?.channel}>
        {selected && (
          <div className="space-y-5">
            <StatusBadge status={selected.status} />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Stat label="Sent" value={selected.sent} />
              <Stat label="Delivered" value={selected.delivered} />
              <Stat label="Failed" value={selected.failed} />
              <Stat label="Opened" value={selected.opened ?? 0} />
            </div>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-xs text-[#667085] bg-gray-50/50">
              Message preview with dynamic variables (preferred customer name, masked email, journey reference,
              account type, link expiry, campaign reward information) would render here.
            </div>
            <div className="flex flex-wrap gap-2">
              <SecondaryButton
                onClick={() =>
                  showToast(
                    selected.channel === "Email"
                      ? "Test email sent to your registered admin address."
                      : "Test SMS sent to your registered admin number."
                  )
                }
              >
                <Send size={14} /> Test send
              </SecondaryButton>
              <SecondaryButton onClick={() => setHistoryOpen(true)}>Version history</SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  if (selected.status !== "Draft") {
                    showToast(`${selected.name} is already ${selected.status.toLowerCase()}.`);
                    return;
                  }
                  updateSelected({ status: "Pending approval" });
                  showToast(`${selected.name} submitted for approval.`);
                }}
              >
                Submit for approval
              </PrimaryButton>
            </div>
          </div>
        )}
      </Drawer>

      {selected && (
        <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} title="Version history" subtitle={selected.name}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm rounded-lg border border-gray-100 px-3 py-2.5">
              <div>
                <p className="text-[#101828] font-medium">Current version</p>
                <p className="text-[11px] text-[#98A2B3]">Updated {selected.lastUpdated}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="flex items-center justify-between text-sm rounded-lg border border-gray-100 px-3 py-2.5">
              <div>
                <p className="text-[#101828] font-medium">Previous version</p>
                <p className="text-[11px] text-[#98A2B3]">Superseded on last publish</p>
              </div>
              <StatusBadge status="Archived" />
            </div>
          </div>
        </Modal>
      )}

      <Modal
        open={newTemplateOpen}
        onClose={() => setNewTemplateOpen(false)}
        title="New template"
        subtitle="Create a new communication template draft"
        footer={
          <>
            <SecondaryButton onClick={() => setNewTemplateOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                if (!templateName.trim()) return;
                const id = `CM-${String(communications.length + 1).padStart(2, "0")}`;
                const newTemplate: CommunicationTemplate = {
                  id,
                  name: templateName.trim(),
                  channel: templateChannel,
                  status: "Draft",
                  lastUpdated: "Today",
                  sent: 0,
                  delivered: 0,
                  failed: 0,
                };
                setCommunications((prev) => [newTemplate, ...prev]);
                showToast(`${newTemplate.name} created as a new draft template.`);
                setNewTemplateOpen(false);
              }}
            >
              Create template
            </PrimaryButton>
          </>
        }
      >
        <FormField label="Template name">
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g. Second reminder before link expiry"
            className={inputClass}
          />
        </FormField>
        <FormField label="Channel">
          <select
            value={templateChannel}
            onChange={(e) => setTemplateChannel(e.target.value as CommunicationTemplate["channel"])}
            className={inputClass}
          >
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
          </select>
        </FormField>
      </Modal>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2.5">
      <p className="text-[#98A2B3] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#101828]">{formatNumber(value)}</p>
    </div>
  );
}
