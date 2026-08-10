import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Panel, SecondaryButton, SelectFilter, TextFilter, Toolbar } from "@/app/components/admin/ui";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { reports } from "@/app/lib/mockData";

const categories = Array.from(new Set(reports.map((r) => r.category)));

export default function ReportsPage() {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  usePageHeader(
    "Reports & Analytics",
    "24 standard operational, campaign, compliance and audit reports."
  );

  const rows = useMemo(
    () =>
      reports.filter(
        (r) => (!category || r.category === category) && (!query || r.name.toLowerCase().includes(query.toLowerCase()))
      ),
    [category, query]
  );

  return (
    <div>
      <Toolbar columns={3}>
        <TextFilter value={query} onChange={setQuery} placeholder="Search reports..." className="w-full col-span-2" />
        <SelectFilter label="Category" value={category} onChange={setCategory} options={categories} className="w-full" />
      </Toolbar>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.map((r) => (
          <Panel key={r.id} className="flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-[#5584CE]/10 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-[#5584CE]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#101828] leading-snug">{r.name}</p>
                <p className="text-[11px] text-[#98A2B3] mt-0.5">{r.category}</p>
              </div>
            </div>
            <p className="text-xs text-[#667085] mb-4 flex-1">{r.description}</p>
            <div className="flex items-center justify-between text-[11px] text-[#98A2B3] border-t border-gray-100 pt-3">
              <span>Last run {r.lastRun}</span>
              <SecondaryButton className="!px-2.5 !py-1.5">
                <Download size={12} /> Run &amp; export
              </SecondaryButton>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
