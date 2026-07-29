import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Chat } from "@/shared/ui/icons/Chat";
import { Check } from "@/shared/ui/icons/Check";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** 24시간 내면 "N시간 전", 아니면 "MM.DD". */
function toDisplayDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff >= 0 && diff < DAY_MS) {
    const hours = Math.max(1, Math.floor(diff / HOUR_MS));
    return `${hours}시간 전`;
  }
  const [, month, day] = iso.slice(0, 10).split("-");
  return month && day ? `${month}.${day}` : iso;
}

function bottomLeftText(item: ReportListItem): string {
  if (item.status === "AWAITING_ADOPTION") {
    if (item.adjusterNickname && item.proposalCount > 1) {
      return `${item.adjusterNickname} 외 ${item.proposalCount - 1}명이 제안을 보냈어요`;
    }
    if (item.adjusterNickname) return `${item.adjusterNickname}님이 제안을 보냈어요`;
    return `제안 ${item.proposalCount}건이 도착했어요`;
  }
  if (item.status === "AWAITING_INSPECTION") return "검수 완료 후 제안을 받을 수 있어요";
  if (item.status === "MATCHED") {
    if (item.adjusterNickname) return `상담 종결 · ${item.adjusterNickname} 사정사`;
    return `제안 ${item.proposalCount}건 · 미진행 종결`;
  }
  return `제안 ${item.proposalCount}건`;
}

function TopBadges({ item }: { item: ReportListItem }) {
  if (item.status === "AWAITING_ADOPTION") {
    return (
      <>
        <StatusBadge tone="gold" className="rounded-pill">
          제안 도착
        </StatusBadge>
        {item.newProposalCount ? (
          <StatusBadge tone="terra" className="rounded-[0.3125rem] px-1.5 py-0.5 text-[0.625rem]">
            NEW {item.newProposalCount}
          </StatusBadge>
        ) : null}
      </>
    );
  }
  if (item.status === "AWAITING_INSPECTION") {
    return (
      <StatusBadge tone="gold" className="rounded-pill" icon={<Spinner />}>
        검수 대기 중
      </StatusBadge>
    );
  }
  if (item.status === "MATCHED") {
    return (
      <StatusBadge
        tone="neutral"
        className="rounded-pill bg-ink-3/[0.13] text-ink-3"
        icon={<Check className="size-3" />}
      >
        종결
      </StatusBadge>
    );
  }
  return null;
}

export function ReceivedProposalCard({ item }: { item: ReportListItem }) {
  const heading = item.title ?? item.accidentType ?? "";
  const isArrived = item.status === "AWAITING_ADOPTION";
  const isPending = item.status === "AWAITING_INSPECTION";
  const isClosed = item.status === "MATCHED";

  return (
    <Link
      href={`/customer/proposals/${item.reportId}`}
      className={cn(
        "block rounded-card border p-4 shadow-card transition hover:brightness-[.99] md:p-5",
        isArrived
          ? "border-line bg-card"
          : isClosed
            ? "border-line-2 bg-paper-2"
            : "border-line bg-paper-2",
      )}
    >
      <div className="flex items-center gap-1.5">
        <TopBadges item={item} />
        {!isPending && (
          <span className="ml-auto text-[0.71875rem] text-ink-3">
            {toDisplayDate(item.reviewedAt ?? item.createdAt)}
          </span>
        )}
      </div>

      <p
        className={cn(
          "mt-3 text-[0.9375rem] font-bold leading-[1.2]",
          isClosed ? "text-ink-3" : "text-ink",
        )}
      >
        {heading}
      </p>
      <p className="mt-1.5 text-[0.71875rem] text-ink-3">No.{item.reportNo}</p>

      <div className="mt-3 flex items-center justify-between border-t border-line-2 pt-2.5">
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-[0.75rem]",
            isClosed ? "text-ink-3" : "text-ink-2",
          )}
        >
          {bottomLeftText(item)}
        </span>
        <span
          className={cn(
            "ml-2 flex shrink-0 items-center gap-1 text-[0.75rem] font-bold",
            isArrived ? "text-gold-ink" : "text-ink-3",
          )}
        >
          {isArrived && <Chat className="size-[0.875rem]" />}
          제안 {item.proposalCount} 건
          <ChevronRight className="text-[0.875rem] text-ink-3" />
        </span>
      </div>
    </Link>
  );
}
