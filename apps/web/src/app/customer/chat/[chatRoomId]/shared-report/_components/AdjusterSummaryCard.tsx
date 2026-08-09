import Link from "next/link";
import { formatManwon, formatManwonRange } from "@/shared/lib/format-amount";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import type { SharedReport } from "../_model/shared-report.schema";

const ESTIMATE_PENDING_LABEL = "산정 중";

function formatEstimate(estimate: SharedReport["estimate"]): string {
  const { min, max } = estimate;
  if (min == null && max == null) return ESTIMATE_PENDING_LABEL;
  if (min != null && max != null) return formatManwonRange(min, max);
  const single = min ?? max;
  return single == null ? ESTIMATE_PENDING_LABEL : `${formatManwon(single)}만원`;
}

export interface AdjusterSummaryCardProps {
  adjuster: SharedReport["adjuster"];
  estimate: SharedReport["estimate"];
  offeredAmount: number | null;
}

export function AdjusterSummaryCard({
  adjuster,
  estimate,
  offeredAmount,
}: AdjusterSummaryCardProps) {
  return (
    <section className="rounded-card border border-line bg-card p-[1.1875rem] lg:rounded-card-lg lg:p-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link
          href={`/customer/adjusters/${adjuster.adjusterId}`}
          className="flex items-center gap-0.5 text-[1rem] font-bold text-ink transition hover:text-gold-ink"
        >
          {adjuster.name}
          <ChevronRight className="text-[1rem] text-ink-3" />
        </Link>
        <span className="text-[0.8125rem] text-ink-3">손해사정사</span>
        {adjuster.career != null && (
          <span className="text-[0.8125rem] text-ink-3">· {adjuster.career}년차</span>
        )}
      </div>

      {adjuster.specialties.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {adjuster.specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-tag border border-line bg-paper-2 px-2 py-1 text-[0.75rem] font-medium text-ink-2"
            >
              {specialty}
            </span>
          ))}
        </div>
      )}

      <dl className="mt-4 space-y-2.5 border-t border-line-2 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[0.8125rem] text-ink-2">예상 보상 범위</dt>
          <dd className="font-serif text-[1.25rem] font-bold text-gold-ink">
            {formatEstimate(estimate)}
          </dd>
        </div>
        {offeredAmount != null && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[0.8125rem] text-ink-2">보험사 제시액</dt>
            <dd className="text-[0.9375rem] font-semibold text-ink">
              {formatManwon(offeredAmount)}만원
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
