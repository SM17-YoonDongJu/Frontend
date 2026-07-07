"use client";

import {
  useReportHistoryFilter,
  type SelectableReportStatus,
} from "../_hooks/use-report-history-filter";

const FILTER_OPTIONS: { value: SelectableReportStatus | null; label: string }[] = [
  { value: null, label: "전체" },
  { value: "COUNSELING", label: "상담 전환" },
  { value: "CLOSED", label: "종결" },
];

export function CustomerReportsFilterBar() {
  const { status, setStatus } = useReportHistoryFilter();

  return (
    <div className="flex gap-2 overflow-x-auto px-5 pt-2 pb-1">
      {FILTER_OPTIONS.map(({ value, label }) => {
        const active = status === value;
        return (
          <button
            key={label}
            type="button"
            onClick={() => setStatus(value)}
            aria-pressed={active}
            className={`shrink-0 rounded-pill border px-4 py-[0.5625rem] text-[0.84375rem] font-semibold transition ${
              active
                ? "border-ink bg-ink text-white"
                : "border-line bg-card text-ink-2 hover:brightness-[.98]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
