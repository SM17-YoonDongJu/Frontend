import type { ReactNode } from "react";
import { REPORT_TITLE } from "../_model/report-meta";

export interface ReportHeaderProps {
  accidentType: string;
  treatment: string;
  issueCount: number;
  actions?: ReactNode;
}

export function ReportHeader({ accidentType, treatment, issueCount, actions }: ReportHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-3">
          <span className="rounded-pill bg-paper-2 px-2.5 py-1">{accidentType}</span>
          <span className="rounded-pill bg-paper-2 px-2.5 py-1">{treatment}</span>
          <span className="flex items-center gap-1 rounded-pill bg-green-soft px-2.5 py-1 text-green">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            검수 의견 {issueCount}건
          </span>
        </div>
        <h1 className="mt-2 font-serif text-[26px] font-bold text-ink">{REPORT_TITLE}</h1>
      </div>

      {actions}
    </header>
  );
}
