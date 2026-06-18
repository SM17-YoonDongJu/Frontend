import { StatusBadge } from "@/shared/ui/StatusBadge";
import { REPORT_STATUS_META } from "../_model/report-status";
import type { ReportStatus } from "../_model/types";

export interface ReportSummaryProps {
  status: ReportStatus;
  accidentType: string;
  treatment: string;
  reviewComment?: string | null;
  reviewedAt?: string | null;
  adjusterName?: string | null;
}

export function ReportSummary({
  status,
  accidentType,
  treatment,
  reviewComment,
  reviewedAt,
  adjusterName,
}: ReportSummaryProps) {
  const meta = REPORT_STATUS_META[status];

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold text-ink">
          {adjusterName ? `${adjusterName} 손해사정사의 검수 의견` : "리포트 요약"}
        </h2>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </div>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[14px]">
        <dt className="text-ink-3">사고 유형</dt>
        <dd className="text-ink">{accidentType}</dd>
        <dt className="text-ink-3">진단·치료</dt>
        <dd className="text-ink">{treatment}</dd>
      </dl>

      {reviewComment && (
        <div className="mt-4 rounded-card border border-line-2 bg-paper-2 p-4">
          <p className="text-[14px] leading-relaxed text-ink-2">{reviewComment}</p>
          {reviewedAt && <p className="mt-2 text-[12.5px] text-ink-3">{reviewedAt} 검수 완료</p>}
        </div>
      )}
    </section>
  );
}
