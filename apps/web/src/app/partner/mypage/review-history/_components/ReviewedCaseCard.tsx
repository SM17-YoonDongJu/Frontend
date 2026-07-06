import { accidentTypeLabel } from "@/shared/model/accident-type";
import { Check } from "@/shared/ui/icons/Check";
import { Star } from "@/shared/ui/icons/Star";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { reviewStatusMeta } from "../_model/review-status-meta";
import type { ReviewedReportItem } from "../_model/types";

const toManwon = (won: number) => Math.round(won / 10_000).toLocaleString("ko-KR");

/** "2026-05-21" → "05.21" (검수 완료일 축약 표기). */
function toShortDate(isoDate: string) {
  const [, month, day] = isoDate.split("-");
  return month && day ? `${month}.${day}` : isoDate;
}

function formatConfirmedRange(min: number, max?: number | null) {
  if (max != null && max !== min) return `${toManwon(min)}–${toManwon(max)}만`;
  return `${toManwon(min)}만`;
}

/*
 * TODO(⚠️확인필요-2): 카드 → 검수 상세 라우팅 키 미확정(caseId vs reportId).
 * 상세 화면은 별도 이슈. 키 확정 시 이 카드 전체를 <Link href> 단일 요소로 감싼다
 * (인터랙티브 중첩 금지 규칙 준수). 현재는 비활성(비링크) 프레젠테이션.
 */
export function ReviewedCaseCard({ item }: { item: ReviewedReportItem }) {
  const meta = reviewStatusMeta(item.status);
  const hasRange = item.confirmedMinAmount != null;
  const hasRating = item.rating != null;

  return (
    <article className="rounded-card border border-line bg-card p-[1.0625rem] shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
      <div className="flex items-center gap-2">
        {item.accidentType && (
          <StatusBadge tone="gold" className="rounded-tag">
            {accidentTypeLabel(item.accidentType)}
          </StatusBadge>
        )}
        <span className="text-[0.71875rem] text-ink-3">#{item.caseId}</span>
        <span className="ml-auto text-[0.71875rem] text-ink-3">{toShortDate(item.sentDate)}</span>
      </div>

      <p className="mt-2 text-[0.875rem] font-bold leading-[1.45] text-ink">{item.title}</p>

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
            {item.statusLabel}
          </StatusBadge>
          {hasRating && (
            <span className="flex items-center gap-[0.1875rem]">
              <Star className="size-[0.8125rem] fill-gold-2 text-gold-2" />
              <span className="text-[0.78125rem] font-bold text-ink">{item.rating?.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
