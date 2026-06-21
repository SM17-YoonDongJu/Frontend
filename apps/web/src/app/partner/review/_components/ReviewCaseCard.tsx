import { AmountRange } from "@/shared/ui/AmountRange";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import type { ReviewListItem } from "../_model/types";

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
  return (
    <button
      type="button"
      onClick={() => onSelect(item.reportId)}
      aria-pressed={selected}
      disabled={item.held}
      className={`w-full rounded-card-lg border px-5 py-4 text-left transition ${
        item.held
          ? "border-line-2 bg-paper-2 opacity-60"
          : selected
            ? "border-gold bg-gold-soft"
            : "border-line bg-card hover:border-gold"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="navy">{item.accidentType}</StatusBadge>
          {item.held && <StatusBadge tone="neutral">보류</StatusBadge>}
          {!item.held && isNew(item.createdAt) && <StatusBadge tone="terra">NEW</StatusBadge>}
          <span className="text-xs text-ink-3">#{item.caseId}</span>
          <span className="text-xs text-ink-3">· {item.region}</span>
        </div>
        <span className="shrink-0 text-sm font-semibold text-gold">매칭 {item.matchingScore}%</span>
      </div>

      <p className="mt-2 text-[15px] font-semibold text-ink">{item.title}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-3">
        <span className="inline-flex items-center gap-1">
          예상 보상
          <AmountRange min={item.claimedMinAmount} max={item.claimedMaxAmount} />
        </span>
        <span>
          제안 여력 <span className="font-semibold text-green">+약 {toManwon(item.offerHeadroom)}만</span>
        </span>
        <span>
          경쟁 <span className="font-semibold text-ink">{item.competitorCount}건</span>
        </span>
      </div>
    </button>
  );
}
