import { useState } from "react";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import GeneralOverviewTab from "./GeneralOverviewTab";
import PerformanceTab from "./PerformanceTab";

const tabs = ["General Overview", "Performance"] as const;

export default function DashboardPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("General Overview");
  usePageHeader(
    "Dashboard",
    "Enterprise view of onboarding, performance and operational risk."
  );

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t ? "border-[#5584CE] text-[#5584CE]" : "border-transparent text-[#667085] hover:text-[#344054]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "General Overview" ? <GeneralOverviewTab /> : <PerformanceTab />}
    </div>
  );
}
