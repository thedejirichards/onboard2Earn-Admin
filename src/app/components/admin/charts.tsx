// Lightweight, dependency-free chart primitives. The brief calls for charts only
// where they aid comparison or trend reading — kept intentionally simple.

export function Sparkline({ data, color = "#5584CE", height = 40 }: { data: number[]; color?: string; height?: number }) {
  const width = 160;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" height={height}>
      <polygon points={areaPoints} fill={color} opacity={0.08} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HorizontalBarList({
  items,
  valueFormatter = (v: number) => v.toLocaleString(),
  color = "#5584CE",
}: {
  items: { name: string; volume: number; rate?: number }[];
  valueFormatter?: (v: number) => string;
  color?: string;
}) {
  const max = Math.max(...items.map((i) => i.volume), 1);
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.name}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#344054] font-medium truncate">{item.name}</span>
            <span className="text-[#667085] tabular-nums shrink-0 ml-2">
              {valueFormatter(item.volume)}
              {typeof item.rate === "number" && <span className="text-[#98A2B3]"> · {item.rate}% rate</span>}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(item.volume / max) * 100}%`, backgroundColor: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FunnelChart({ steps }: { steps: { stage: string; count: number; dropOff: number }[] }) {
  const max = steps[0]?.count || 1;
  return (
    <div className="space-y-2.5">
      {steps.map((s, i) => {
        const prev = i > 0 ? steps[i - 1].count : s.count;
        const stepConversion = prev > 0 ? Math.round((s.count / prev) * 100) : 100;
        const overallConversion = Math.round((s.count / max) * 100);
        return (
          <div key={s.stage} className="flex items-center gap-3">
            <span className="text-xs text-[#667085] w-6 shrink-0 tabular-nums">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#344054] font-medium truncate">{s.stage}</span>
                <span className="text-[#667085] tabular-nums shrink-0 ml-2">
                  {s.count.toLocaleString()}
                  {i > 0 && <span className="text-[#98A2B3]"> · {stepConversion}% from prev</span>}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5584CE]"
                  style={{ width: `${overallConversion}%` }}
                />
              </div>
            </div>
            {i > 0 && (
              <span className="text-[11px] text-red-500 w-20 text-right shrink-0 tabular-nums">
                −{s.dropOff.toLocaleString()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
