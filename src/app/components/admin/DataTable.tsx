import { ReactNode, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyState, RowActionButton } from "./ui";

const PAGE_SIZE = 5;

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

// Standard trailing "Actions" column — every table gets a text "View" button.
export function actionsColumn<T>(onView: (row: T) => void, label = "View"): Column<T> {
  return {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <RowActionButton label={label} onClick={() => onView(row)}>
        {label}
      </RowActionButton>
    ),
  };
}

export function DataTable<T>({
  columns,
  rows,
  keyField,
  emptyTitle = "No records found",
  emptyDescription = "No records match the selected filters.",
}: {
  columns: Column<T>[];
  rows: T[];
  keyField: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [page, setPage] = useState(0);

  // Filters/searches produce a new rows array — return to page 1 whenever the result set changes.
  useEffect(() => {
    setPage(0);
  }, [rows]);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-gray-300 bg-white">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const start = currentPage * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);
  // The trailing Actions column (added via actionsColumn) is pinned to the right,
  // alongside the S/N column pinned to the left, so both stay visible while the
  // columns between them scroll horizontally.
  const hasActionsColumn = columns.length > 0 && columns[columns.length - 1].key === "actions";

  return (
    <div className="rounded-xl border border-gray-300 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="sticky left-0 z-20 bg-gray-50 text-left font-medium text-[#667085] text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap w-12">
                S/N
              </th>
              {columns.map((c, idx) => {
                const stickyRight = hasActionsColumn && idx === columns.length - 1;
                return (
                  <th
                    key={c.key}
                    className={`text-left font-medium text-[#667085] text-xs uppercase tracking-wide px-4 py-3 whitespace-nowrap ${
                      stickyRight ? "sticky right-0 z-20 bg-gray-50" : ""
                    }`}
                  >
                    {c.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={keyField(row)} className="border-b border-gray-50 last:border-0">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 text-[#98A2B3] align-middle whitespace-nowrap tabular-nums">
                  {start + i + 1}
                </td>
                {columns.map((c, idx) => {
                  const stickyRight = hasActionsColumn && idx === columns.length - 1;
                  return (
                    <td
                      key={c.key}
                      className={`px-4 py-3 text-[#344054] align-middle whitespace-nowrap ${c.className ?? ""} ${
                        stickyRight ? "sticky right-0 z-10 bg-white" : ""
                      }`}
                    >
                      {c.render(row)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 items-center gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/40">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="justify-self-start inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          <ChevronLeft size={13} /> Previous
        </button>
        <span className="justify-self-center text-xs text-[#98A2B3] tabular-nums">
          Page {currentPage + 1} of {pageCount}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={currentPage === pageCount - 1}
          className="justify-self-end inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
