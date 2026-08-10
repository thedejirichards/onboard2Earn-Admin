import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Panel, PrimaryButton, SelectFilter, Toolbar } from "@/app/components/admin/ui";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { supportFaqs } from "@/app/lib/mockData";

const categories = Array.from(new Set(supportFaqs.map((f) => f.category)));

export default function SupportContentPage() {
  const [category, setCategory] = useState("");
  usePageHeader(
    "Support Content",
    "FAQs, error explanations and escalation guidance for employees."
  );

  const rows = useMemo(() => supportFaqs.filter((f) => !category || f.category === category), [category]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PrimaryButton><Plus size={14} /> New FAQ</PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Panel>
          <p className="text-xs text-[#667085] mb-1">Support telephone</p>
          <p className="text-sm font-semibold text-[#101828]">0700-300-0000</p>
        </Panel>
        <Panel>
          <p className="text-xs text-[#667085] mb-1">Support email</p>
          <p className="text-sm font-semibold text-[#101828]">staffassist-support@accessbankplc.com</p>
        </Panel>
        <Panel>
          <p className="text-xs text-[#667085] mb-1">Operating hours</p>
          <p className="text-sm font-semibold text-[#101828]">Mon – Fri, 8:00 – 18:00 WAT</p>
        </Panel>
      </div>

      <Toolbar>
        <SelectFilter label="Category" value={category} onChange={setCategory} options={categories} className="w-full" />
      </Toolbar>

      <div className="space-y-3">
        {rows.map((f) => (
          <Panel key={f.id}>
            <div className="flex items-start justify-between gap-4 mb-1.5">
              <p className="text-sm font-semibold text-[#101828]">{f.question}</p>
              <StatusBadge status={f.status} />
            </div>
            <p className="text-xs text-[#667085] mb-2">{f.answer}</p>
            <div className="flex items-center gap-3 text-[11px] text-[#98A2B3]">
              <span>{f.category}</span>
              <span>·</span>
              <span>Updated {f.lastUpdated}</span>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
