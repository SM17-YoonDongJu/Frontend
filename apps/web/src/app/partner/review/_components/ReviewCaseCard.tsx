import { Chevron } from "@/shared/ui/icons/Chevron";
import { StatusBadge, type StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReviewListItem } from "../_model/types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

const TYPE_TONE: Record<string, Tone> = {
  후유장해: "gold",
};

const toManwon = (won: number) => Math.round(won / 10_000).toLocaleString("ko-KR");

function isNew(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 2 * 24 * 60 * 60 * 1000;
}

interface Props {
  item: ReviewListItem;
  selected: boolean;
  onSelect: (reportId: string) => void;
}

export function ReviewCaseCard({ item, selected, onSelect }: Props) {
  const held = item.held ?? false;
  const hasRange = item.claimedMinAmount != null && item.claimedMaxAmount != null;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.reportId)}
      aria-pressed={selected}
      disabled={held}
      className={`w-full rounded-card-lg border px-5 py-4 text-left transition ${
        held
          ? "border-line-2 bg-paper-2 opacity-60"
          : selected
            ? "border-gold bg-gold-soft/30"
            : "border-line bg-card hover:border-gold"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={TYPE_TONE[item.accidentType] ?? "neutral"}>
            {item.accidentType}
          </StatusBadge>
          {held && <StatusBadge tone="neutral">보류</StatusBadge>}
          {!held && isNew(item.createdAt) && <StatusBadge tone="gold">NEW</StatusBadge>}
          {item.caseId && <span className="text-xs text-ink-3">#{item.caseId}</span>}
          {item.region && (
            <span className="inline-flex items-center gap-1 rounded-pill bg-paper-2 px-2 py-0.5 text-xs text-ink-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              {item.region}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-[15px] font-semibold text-ink">{item.title ?? item.accidentType}</p>

      <div className="mt-3 flex items-center gap-6">
        {hasRange && (
          <div>
            <p className="text-[12px] text-ink-3">예상 보상 범위</p>
            <p className="mt-0.5 font-semibold tabular-nums text-ink">
              {toManwon(item.claimedMinAmount!)} – {toManwon(item.claimedMaxAmount!)}만
            </p>
          </div>
        )}
        {item.offerHeadroom != null && (
          <div className="border-l border-line pl-6">
            <p className="text-[12px] text-ink-3">제안 대비</p>
            <p className="mt-0.5 font-semibold tabular-nums text-gold">
              + 약 {toManwon(item.offerHeadroom)}만
            </p>
          </div>
        )}
        {item.issueCount != null && (
          <div className="border-l border-line pl-6">
            <p className="text-[12px] text-ink-3">쟁점</p>
            <p className="mt-0.5 font-semibold tabular-nums text-ink">{item.issueCount}건</p>
          </div>
        )}

        {selected && !held && (
          <span className="ml-auto inline-flex items-center gap-1 self-center text-sm text-gold">
            미리보기 중
            <Chevron />
          </span>
        )}
      </div>
    </button>
  );
}
