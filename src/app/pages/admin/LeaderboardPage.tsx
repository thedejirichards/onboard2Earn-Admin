import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowDown, ArrowUp, Download, Minus, Trophy } from "lucide-react";
import { SecondaryButton, SelectFilter, Toolbar } from "@/app/components/admin/ui";
import { DataTable, Column, actionsColumn } from "@/app/components/admin/DataTable";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { usePageHeader } from "@/app/lib/PageHeaderContext";
import { leaderboard } from "@/app/lib/mockData";
import { downloadCsv } from "@/app/lib/csv";
import { formatNaira, formatNumber } from "@/app/lib/format";
import type { LeaderboardEntry } from "@/app/lib/types";

const leagues = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
const leagueColor: Record<string, string> = {
  Bronze: "#B08D57", Silver: "#94A3B8", Gold: "#EAB308", Platinum: "#64748B", Diamond: "#38BDF8",
};

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [league, setLeague] = useState("");
  usePageHeader(
    "Leaderboard",
    "Bronze to Diamond leagues, aligned with the employee application."
  );

  const rows = useMemo(() => leaderboard.filter((e) => !league || e.league === league), [league]);

  const columns: Column<LeaderboardEntry>[] = [
    { key: "rank", header: "Rank", render: (e) => <span className="font-semibold text-[#101828]">#{e.rank}</span> },
    { key: "name", header: "Employee", render: (e) => (
      <div>
        <p className="text-[#101828] font-medium">{e.name}</p>
        <p className="text-[11px] text-[#98A2B3]">{e.orgUnit}</p>
      </div>
    ) },
    { key: "league", header: "League", render: (e) => (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: leagueColor[e.league] }}>
        <Trophy size={13} /> {e.league}
      </span>
    ) },
    { key: "points", header: "Points", render: (e) => formatNumber(e.points) },
    { key: "movement", header: "Movement", render: (e) => <Movement value={e.movement} /> },
    { key: "accounts", header: "Accounts opened", render: (e) => e.accountsOpened },
    { key: "activation", header: "Activation rate", render: (e) => `${e.activationRate}%` },
    { key: "funding", header: "Funding rate", render: (e) => `${e.fundingRate}%` },
    { key: "deposit", header: "Deposit mobilised", render: (e) => formatNaira(e.depositMobilised) },
    { key: "gate", header: "Reward gate", render: (e) => <StatusBadge status={e.gateResult} /> },
    { key: "status", header: "Movement status", render: (e) => <StatusBadge status={e.status} /> },
    { key: "reward", header: "Reward status", render: (e) => <StatusBadge status={e.rewardStatus} /> },
    actionsColumn<LeaderboardEntry>((e) => navigate(`/staff/${e.staffId}`), "View"),
  ];

  return (
    <div>
      <Toolbar
        actions={
          <SecondaryButton
            onClick={() =>
              downloadCsv(
                "leaderboard",
                rows.map((e) => ({
                  rank: e.rank,
                  name: e.name,
                  orgUnit: e.orgUnit,
                  league: e.league,
                  points: e.points,
                  movement: e.movement,
                  accountsOpened: e.accountsOpened,
                  activationRate: e.activationRate,
                  fundingRate: e.fundingRate,
                  depositMobilised: e.depositMobilised,
                  gateResult: e.gateResult,
                  status: e.status,
                  rewardStatus: e.rewardStatus,
                }))
              )
            }
          >
            <Download size={14} /> Export leaderboard
          </SecondaryButton>
        }
      >
        <SelectFilter label="League" value={league} onChange={setLeague} options={leagues} className="w-full" />
      </Toolbar>

      <DataTable columns={columns} rows={rows} keyField={(e) => e.staffId} />
    </div>
  );
}

function Movement({ value }: { value: number }) {
  if (value === 0) return <span className="inline-flex items-center gap-1 text-xs text-gray-500"><Minus size={12} /> 0</span>;
  const up = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-red-600"}`}>
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(value)}
    </span>
  );
}
