import { useState } from "react";
import Modal, { FormField, inputClass } from "./Modal";
import { PrimaryButton, SecondaryButton } from "./ui";
import { caseOwners } from "@/app/lib/mockData";

export default function AssignOwnerModal({
  open,
  onClose,
  title,
  subtitle,
  currentOwner,
  onAssign,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  currentOwner?: string | null;
  onAssign: (owner: string) => void;
}) {
  const [owner, setOwner] = useState(currentOwner ?? "");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={() => {
              if (!owner) return;
              onAssign(owner);
              onClose();
            }}
          >
            Assign
          </PrimaryButton>
        </>
      }
    >
      <FormField label="Owner">
        <select value={owner} onChange={(e) => setOwner(e.target.value)} className={inputClass}>
          <option value="">Select an owner...</option>
          {caseOwners.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </FormField>
    </Modal>
  );
}
