import Link from "next/link";
import { Check } from "@/shared/ui/icons/Check";
import { Star } from "@/shared/ui/icons/Star";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { getAccidentTone } from "@/app/customer/_shared/model/report-status";
import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";
import { reportCardStatusMeta } from "../_model/report-card-status-meta";

const toManwon = (won: number) => Math.round(won / 10_000).toLocaleString("ko-KR");

/** "2026-05-22T10:14:00Z" | "2026-05-22" → "05.22". */
function toShortDate(iso: string) {
  const [, month, day] = iso.slice(0, 10).split("-");
  return month && day ? `${month}.${day}` : iso;
}

function formatConfirmedRange(min: number, max?: number | null) {
  if (max != null && max !== min) return `${toManwon(min)}–${toManwon(max)}만`;
  return `${toManwon(min)}만`;
}

export function ReportHistoryCard({ item }: { item: ReportListItem }) {
  const meta = reportCardStatusMeta(item.status);
  const tone = getAccidentTone(item.accidentType);
  const hasRange = item.confirmedMinAmount != null;
  const hasRating = item.rating != null;
  const displayDate = toShortDate(item.reviewedAt ?? item.createdAt);

  return (
    <Link
      href={`/customer/report/${item.reportId}`}
      className="block rounded-card border border-line bg-card p-[1.0625rem] shadow-[0_1px_1px_rgba(21,32,46,0.03)] transition hover:brightness-[.99]"
    >
      <div className="flex items-center gap-2">
        <span
          className={`rounded-tag px-2.5 py-1 text-[0.78125rem] font-semibold leading-none ${tone.bg} ${tone.text}`}
        >
          {item.accidentType}
        </span>
        <span className="text-[0.71875rem] text-ink-3">#{item.reportNo}</span>
        <span className="ml-auto text-[0.71875rem] text-ink-3">{displayDate}</span>
      </div>

      {item.title && (
        <p className="mt-2 text-[0.875rem] font-bold leading-[1.45] text-ink">{item.title}</p>
      )}

      <div className="mt-2 flex items-end justify-between border-t border-line-2 pt-[1.0625rem]">
        {hasRange ? (
          <div>
            <p className="text-[0.625rem] text-ink-3">확정 범위</p>
            <p className="mt-0.5 font-serif text-[0.90625rem] font-bold text-ink">
              {formatConfirmedRange(item.confirmedMinAmount!, item.confirmedMaxAmount)}
            </p>
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2.5">
          <StatusBadge
            tone={meta.tone}
            className="rounded-tag"
            icon={meta.hasCheck ? <Check className="size-3" /> : undefined}
          >
            {meta.label}
          </StatusBadge>
          {hasRating && (
            <span className="flex items-center gap-[0.1875rem]">
              <Star className="size-[0.8125rem] fill-gold-2 text-gold-2" />
              <span className="text-[0.78125rem] font-bold text-ink">
                {item.rating?.toFixed(1)}
              </span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
