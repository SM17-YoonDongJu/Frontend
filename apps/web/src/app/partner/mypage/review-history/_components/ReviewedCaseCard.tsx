import { accidentTypeLabel } from "@/shared/model/accident-type";
import { Check } from "@/shared/ui/icons/Check";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { reviewStatusMeta } from "../_model/review-status-meta";
import type { ReviewedReportItem } from "../_model/types";

/** "2026-05-21T14:03:00" → "05.21" (검수 완료일 축약 표기). */
function toShortDate(isoDate: string) {
  const [, month, day] = isoDate.slice(0, 10).split("-");
  return month && day ? `${month}.${day}` : isoDate;
}

export function ReviewedCaseCard({ item }: { item: ReviewedReportItem }) {
  const meta = reviewStatusMeta(item.status);

  return (
    <article className="rounded-card border border-line bg-card p-[1.0625rem] shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
      <div className="flex items-center gap-2">
        <StatusBadge tone="gold" className="rounded-tag">
          {accidentTypeLabel(item.accidentType)}
        </StatusBadge>
        <span className="text-[0.71875rem] text-ink-3">#{item.caseNo}</span>
        <span className="ml-auto text-[0.71875rem] text-ink-3">{toShortDate(item.reviewedAt)}</span>
      </div>

      <p className="mt-2 text-[0.875rem] font-bold leading-[1.45] text-ink">{item.title}</p>

      <div className="mt-2 flex items-center justify-between border-t border-line-2 pt-[1.0625rem]">
        <span className="text-[0.71875rem] text-ink-3">{item.region}</span>

        <StatusBadge
          tone={meta.tone}
          className="rounded-tag"
          icon={meta.hasCheck ? <Check className="size-3" /> : undefined}
        >
          {meta.label}
        </StatusBadge>
      </div>
    </article>
  );
}
