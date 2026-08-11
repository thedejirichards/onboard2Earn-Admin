import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Panel, PrimaryButton, SecondaryButton, SelectFilter, Toolbar } from "@/app/components/admin/ui";
import Modal, { FormField, inputClass } from "@/app/components/admin/Modal";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { useToast } from "@/app/components/admin/Toast";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { supportFaqs as initialSupportFaqs } from "@/app/lib/mockData";
import type { SupportFaq } from "@/app/lib/types";

const categories = Array.from(new Set(initialSupportFaqs.map((f) => f.category)));

export default function SupportContentPage() {
  const showToast = useToast();
  const [supportFaqs, setSupportFaqs] = useState(initialSupportFaqs);
  const [category, setCategory] = useState("");
  const [newFaqOpen, setNewFaqOpen] = useState(false);
  const [faqCategory, setFaqCategory] = useState(categories[0]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  usePageHeader(
    "Support Content",
    "FAQs, error explanations and escalation guidance for employees."
  );

  const rows = useMemo(() => supportFaqs.filter((f) => !category || f.category === category), [supportFaqs, category]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <PrimaryButton
          onClick={() => {
            setFaqCategory(categories[0]);
            setQuestion("");
            setAnswer("");
            setNewFaqOpen(true);
          }}
        >
          <Plus size={14} /> New FAQ
        </PrimaryButton>
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

      <Modal
        open={newFaqOpen}
        onClose={() => setNewFaqOpen(false)}
        title="New FAQ"
        subtitle="Add a new support FAQ"
        footer={
          <>
            <SecondaryButton onClick={() => setNewFaqOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                if (!question.trim() || !answer.trim()) return;
                const newFaq: SupportFaq = {
                  id: `FAQ-${String(supportFaqs.length + 1).padStart(2, "0")}`,
                  category: faqCategory,
                  question: question.trim(),
                  answer: answer.trim(),
                  status: "Published",
                  lastUpdated: "Today",
                };
                setSupportFaqs((prev) => [newFaq, ...prev]);
                showToast("New FAQ published.");
                setNewFaqOpen(false);
              }}
            >
              Publish FAQ
            </PrimaryButton>
          </>
        }
      >
        <FormField label="Category">
          <select value={faqCategory} onChange={(e) => setFaqCategory(e.target.value)} className={inputClass}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Question">
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What if a customer's link expires?" className={inputClass} />
        </FormField>
        <FormField label="Answer">
          <textarea
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Explain the resolution or escalation path..."
            className={`${inputClass} resize-none`}
          />
        </FormField>
      </Modal>
    </div>
  );
}
