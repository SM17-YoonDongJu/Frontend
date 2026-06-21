import Link from "next/link";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import type { PendingReviewItem } from "../_model/types";
import { PENDING_STATUS_META } from "../_model/status-meta";

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffMinutes = Math.floor((Date.now() - then) / 60_000);
  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
}

export interface PendingReviewCardProps {
  item: PendingReviewItem;
}

export function PendingReviewCard({ item }: PendingReviewCardProps) {
  const meta = PENDING_STATUS_META[item.status];

  return (
    <Link
      href={`/partner/review/${item.reportId}`}
      className="flex flex-col gap-3 rounded-card-lg border border-line bg-card p-5 transition hover:border-ink-3 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
        <span className="text-[12px] text-ink-3">{formatRelative(item.createdAt)}</span>
      </div>
      <h3 className="font-serif text-[16px] font-bold text-ink">{item.accidentType}</h3>
      {item.caseId && <p className="text-[12.5px] text-ink-3">#{item.caseId}</p>}
    </Link>
  );
}
