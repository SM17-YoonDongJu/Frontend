import Link from "next/link";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { StatusBadge, type StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReviewListItem } from "../_model/types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

// Figma 시안 기준 유형별 뱃지 톤 — traffic은 회색(neutral)이 정답값(누락 아님).
const TYPE_TONE: Record<string, Tone> = {
  disability: "gold",
  traffic: "neutral",
  medical_indemnity: "green",
};

const NEW_THRESHOLD_MS = 2 * 24 * 60 * 60 * 1000;

const toManwon = (won: number) => Math.round(won / 10_000).toLocaleString("ko-KR");

// 제안 대비 금액 — 부호를 값에서 분리해 음수여도 "+-N만"으로 깨지지 않게 표기.
const formatHeadroom = (won: number) => `${won < 0 ? "−" : "+"}${toManwon(Math.abs(won))}만`;

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < NEW_THRESHOLD_MS;
}

interface Props {
  item: ReviewListItem;
}

export function ReviewCaseCard({ item }: Props) {
  const hasRange = item.claimedMinAmount != null && item.claimedMaxAmount != null;
  const hasHeadroom = item.offerHeadroom != null;

  return (
    <article className="flex flex-col gap-[0.5625rem] rounded-card border border-line bg-card p-[1.0625rem] shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={TYPE_TONE[item.accidentType] ?? "neutral"}>
          {accidentTypeLabel(item.accidentType)}
        </StatusBadge>
        {isNew(item.createdAt) && <StatusBadge tone="terra">NEW</StatusBadge>}
        {item.caseId && <span className="text-[0.72rem] text-ink-3">#{item.caseId}</span>}
      </div>

      <p className="text-[0.86rem] font-bold tracking-[-0.01rem] text-ink">
        {item.title ?? accidentTypeLabel(item.accidentType)}
      </p>

      {(hasRange || hasHeadroom) && (
        <div className="flex gap-2">
          {hasRange && (
            <div className="flex-1 rounded-[0.625rem] border border-line-2 px-3 py-2.5">
              <p className="text-[0.61rem] text-ink-3">예상 범위</p>
              <p className="mt-0.5 font-serif text-sm tabular-nums text-ink">
                {toManwon(item.claimedMinAmount!)}–{toManwon(item.claimedMaxAmount!)}만
              </p>
            </div>
          )}
          {hasHeadroom && (
            <div className="flex-1 rounded-[0.625rem] border border-line-2 px-3 py-2.5">
              <p className="text-[0.61rem] text-ink-3">제안 대비</p>
              <p className="mt-0.5 text-[0.85rem] font-bold tabular-nums text-gold-ink">
                {formatHeadroom(item.offerHeadroom!)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        {item.region ? (
          <span className="inline-flex items-center gap-1 text-[0.71rem] text-ink-3">
            <span className="size-[0.31rem] rounded-sm bg-gold" />
            {item.region}
          </span>
        ) : (
          <span />
        )}
        <Link
          href={`/partner/review/${item.reportId}`}
          className="inline-flex items-center gap-2 rounded-button bg-ink px-[0.94rem] py-[0.56rem] text-[0.84rem] font-semibold tracking-[-0.01rem] text-white transition hover:brightness-[.96]"
        >
          검수
          <ArrowRight className="size-[0.94rem]" />
        </Link>
      </div>
    </article>
  );
}
