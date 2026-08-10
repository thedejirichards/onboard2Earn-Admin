// Section 24 (Status Language) + Visual status colours: green/amber/red/blue/grey.
// Colour is never the only signal — every badge carries a text label (and callers
// may add an icon alongside it).

type ColorKey = "green" | "amber" | "red" | "blue" | "grey";

const styles: Record<ColorKey, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/20",
  grey: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

const dotStyles: Record<ColorKey, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-sky-500",
  grey: "bg-gray-400",
};

const redWords = [
  "failed", "fail", "expired", "unavailable", "breached", "critical", "rejected",
  "reversed", "referred", "denied", "existing customer", "escalated", "blocked",
  "overdue", "suspended", "high", "mismatch",
];
const amberWords = [
  "pending", "awaiting", "provisional", "delayed", "partial", "due", "scheduled to review",
  "under review", "review", "medium", "degraded", "attention", "paused", "at risk",
  "required", "not yet activated",
];
const blueWords = [
  "active", "progress", "processing", "synchronising", "maintenance", "open", "ready",
  "link sent", "in review process",
];
const greenWords = [
  "completed", "success", "published", "approved", "pass", "resolved", "operational",
  "eligible", "fulfilled", "created", "stored successfully", "clear", "promotion", "qualified", "within",
];
const greyWords = [
  "draft", "inactive", "cancelled", "archived", "not started", "none", "low", "dormant",
  "not yet", "no permission",
];

export function statusColor(status: string): ColorKey {
  const s = status.toLowerCase();
  if (redWords.some((w) => s.includes(w))) return "red";
  if (amberWords.some((w) => s.includes(w))) return "amber";
  if (blueWords.some((w) => s.includes(w))) return "blue";
  if (greenWords.some((w) => s.includes(w))) return "green";
  if (greyWords.some((w) => s.includes(w))) return "grey";
  return "grey";
}

export default function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const color = statusColor(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[color]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[color]}`} />
      {status}
    </span>
  );
}
