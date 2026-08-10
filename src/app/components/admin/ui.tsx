import { Children, ReactNode, useId } from "react";
import { Inbox } from "lucide-react";

export function Panel({ children, className = "", padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <div className={`rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${padded ? "p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  titleClassName = "text-[22px]",
  descriptionClassName = "text-sm",
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className={`font-semibold text-[#101828] ${titleClassName}`}>{title}</h1>
        {description && <p className={`text-[#667085] mt-1 max-w-2xl ${descriptionClassName}`}>{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-11 w-11 rounded-full bg-gray-50 flex items-center justify-center mb-3">
        <Inbox size={18} className="text-gray-400" />
      </div>
      <p className="text-sm font-medium text-[#344054]">{title}</p>
      {description && <p className="text-xs text-[#98A2B3] mt-1 max-w-sm">{description}</p>}
    </div>
  );
}

export function SectionCard({ title, description, children, actions }: { title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#101828]">{title}</h3>
          {description && <p className="text-xs text-[#667085] mt-0.5">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </Panel>
  );
}

export function Toolbar({
  children,
  actions,
  columns,
}: {
  children: ReactNode;
  actions?: ReactNode;
  // Total grid tracks. Defaults to one track per field; pass this explicitly
  // when a field spans more than one track (e.g. a wider search box using
  // `col-span-2` on its own wrapper) so the row still fills edge-to-edge.
  columns?: number;
}) {
  const count = columns ?? Math.min(Math.max(Children.count(children), 1), 6);
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 mb-4">
      <div className="flex flex-wrap items-end gap-3">
        <div
          className="grid gap-3 items-end flex-1 min-w-0"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(140px, 1fr))` }}
        >
          {children}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function SelectFilter({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${className}`}>
      <label htmlFor={id} className="text-xs font-medium text-[#344054]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm rounded-lg border border-gray-200 bg-white px-3 py-2 text-[#344054] focus:outline-none focus:ring-2 focus:ring-[#5584CE]/20 focus:border-[#5584CE]"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextFilter({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#344054]">
          {label}
        </label>
      )}
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm rounded-lg border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5584CE]/20"
      />
    </div>
  );
}

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "brand" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
        tone === "brand" ? "bg-[#5584CE]/10 text-[#5584CE]" : "bg-gray-100 text-gray-600"
      }`}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-[#EE7E01] hover:bg-[#d97101] transition-colors text-white text-sm font-medium px-3.5 py-2 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-[#344054] text-sm font-medium px-3.5 py-2 ${className}`}
    >
      {children}
    </button>
  );
}

// Text button for a table row's Actions column — the sole clickable
// affordance on a table row; the rest of the row is inert.
export function RowActionButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: (e: React.MouseEvent) => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#344054] hover:bg-[#5584CE]/5 hover:border-[#5584CE]/30 hover:text-[#5584CE] transition-colors"
    >
      {children}
    </button>
  );
}
