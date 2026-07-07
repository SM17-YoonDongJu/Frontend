import Link from "next/link";
import { Check } from "@/shared/ui/icons/Check";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { REPORT_STATUS_META } from "@/app/customer/_shared/model/report-status";
import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";

const HOURS_24_MS = 24 * 60 * 60 * 1000;

/** 24시간 내면 "N시간 전", 아니면 "MM.DD". */
function toRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff >= 0 && diff < HOURS_24_MS) {
    const hours = Math.max(1, Math.floor(diff / (60 * 60 * 1000)));
    return `${hours}시간 전`;
  }
  const [, month, day] = iso.slice(0, 10).split("-");
  return month && day ? `${month}.${day}` : iso;
}

function toShortDate(iso: string) {
  const [, month, day] = iso.slice(0, 10).split("-");
  return month && day ? `${month}.${day}` : iso;
}

function bottomLeftText(item: ReportListItem): string | null {
  if (item.status === "AWAITING_ADOPTION" && item.proposalCount > 0) {
    if (!item.adjusterNickname) return `제안 ${item.proposalCount}건이 도착했어요`;
    if (item.proposalCount === 1) return `${item.adjusterNickname}님이 제안을 보냈어요`;
    return `${item.adjusterNickname} 외 ${item.proposalCount - 1}명이 제안을 보냈어요`;
  }
  if (item.status === "CLOSED" && item.adjusterNickname) {
    return `상담 종결 · ${item.adjusterNickname} 사정사`;
  }
  if (item.status === "AWAITING_INSPECTION") {
    return "검수 완료 후 제안을 받을 수 있어요";
  }
  return null;
}

function TopLabel({ item }: { item: ReportListItem }) {
  const dateSource = item.reviewedAt ?? item.createdAt;

  if (item.status === "AWAITING_ADOPTION") {
    return (
      <>
        <StatusBadge tone="gold" className="rounded-pill">
          제안 도착
        </StatusBadge>
        {item.proposalCount > 0 && (
          <span className="rounded-pill bg-terra px-2 py-0.5 text-[0.6875rem] font-bold text-white">
            NEW {item.proposalCount}
          </span>
        )}
        <span className="ml-auto text-[0.71875rem] text-ink-3">{toRelativeTime(dateSource)}</span>
      </>
    );
  }

  if (item.status === "CLOSED") {
    return (
      <>
        <StatusBadge tone="neutral" className="rounded-pill" icon={<Check className="size-3" />}>
          종결
        </StatusBadge>
        <span className="ml-auto text-[0.71875rem] text-ink-3">{toShortDate(dateSource)}</span>
      </>
    );
  }

  if (item.status === "AWAITING_INSPECTION") {
    return (
      <StatusBadge
        tone="neutral"
        className="rounded-pill"
        icon={<span aria-hidden className="size-2.5 rounded-full border border-ink-3" />}
      >
        검수 대기 중
      </StatusBadge>
    );
  }

  return (
    <>
      <StatusBadge tone="neutral" className="rounded-pill">
        {REPORT_STATUS_META[item.status].label}
      </StatusBadge>
      <span className="ml-auto text-[0.71875rem] text-ink-3">{toShortDate(dateSource)}</span>
    </>
  );
}

export function ReceivedProposalCard({ item }: { item: ReportListItem }) {
  const heading = item.title ?? item.accidentType;
  const leftText = bottomLeftText(item);
  const showArrow = item.status !== "AWAITING_INSPECTION";

  return (
    <Link
      href={`/customer/proposals/${item.reportId}`}
      className="block rounded-card border border-line bg-card p-[1.0625rem] shadow-card transition hover:brightness-[.99]"
    >
      <div className="flex items-center gap-2">
        <TopLabel item={item} />
      </div>

      <p className="mt-2.5 text-[0.90625rem] font-bold leading-[1.4] text-ink">{heading}</p>
      <p className="mt-1 text-[0.71875rem] text-ink-3">No.{item.reportNo}</p>

      <div className="mt-3 flex items-center justify-between border-t border-line-2 pt-3">
        <span className="min-w-0 flex-1 truncate text-[0.78125rem] text-ink-2">
          {leftText}
        </span>
        <span className="ml-2 flex shrink-0 items-center gap-1 text-[0.78125rem] font-semibold text-ink">
          제안 {item.proposalCount} 건
          {showArrow && <ChevronRight className="text-[0.875rem] text-ink-3" />}
        </span>
      </div>
    </Link>
  );
}
