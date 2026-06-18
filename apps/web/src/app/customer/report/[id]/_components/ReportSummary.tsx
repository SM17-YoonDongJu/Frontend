import { StatusBadge } from "@/shared/ui/StatusBadge";
import { REPORT_STATUS_META } from "../_model/report-status";
import type { ReportStatus } from "../_model/types";

export interface ReportSummaryProps {
  status: ReportStatus;
  reviewComment?: string | null;
  reviewedAt?: string | null;
  adjusterName?: string | null;
  adjusterCareer?: string | null;
}

export function ReportSummary({
  status,
  reviewComment,
  reviewedAt,
  adjusterName,
  adjusterCareer,
}: ReportSummaryProps) {
  const meta = REPORT_STATUS_META[status];
  const subtitle = [adjusterCareer, reviewedAt && `${reviewedAt} 검수`].filter(Boolean).join(" · ");

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold-soft text-[16px] font-semibold text-gold-ink">
          {adjusterName?.slice(0, 1) ?? "사"}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[16px] font-semibold text-ink">
              {adjusterName ? `${adjusterName} 손해사정사의 검수 의견` : "검수 의견"}
            </h2>
            <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          </div>

          {reviewComment && (
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">“{reviewComment}”</p>
          )}
          {subtitle && <p className="mt-2 text-[12.5px] text-ink-3">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
