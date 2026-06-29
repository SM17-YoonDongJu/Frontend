"use client";

import Link from "next/link";
import { TrendingUp } from "@/shared/ui/icons/TrendingUp";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { buttonVariants } from "@/shared/ui/Button";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { useReviewList } from "../review/_api/use-review-list";
import type { ReviewListItem } from "../review/_model/types";
import { formatReviewDue } from "../_model/review-due";
import { SectionCard } from "./SectionCard";
import { PendingReviewEmpty } from "./PendingReviewEmpty";

const PREVIEW_LIMIT = 3;

export function PendingReviewPreview() {
  const { data } = useReviewList({ status: "AWAITING_INSPECTION" });

  const top = [...data.list]
    .sort((a, b) => b.matchingScore - a.matchingScore)
    .slice(0, PREVIEW_LIMIT);

  return (
    <SectionCard
      title="검수 대기 사건"
      description="매칭률이 높은 순으로 보여드려요."
      action={{ label: "전체 보기", href: "/partner/review" }}
    >
      {top.length === 0 ? (
        <PendingReviewEmpty />
      ) : (
        <ul className="space-y-3">
          {top.map((item) => (
            <li key={item.reportId}>
              <PendingReviewRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

function PendingReviewRow({ item }: { item: ReviewListItem }) {
  const due = formatReviewDue(item.reviewDeadline, new Date());

  return (
    <div className="rounded-card border border-line bg-card px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="gold">{accidentTypeLabel(item.accidentType)}</StatusBadge>
        <span className="text-xs text-ink-3">#{item.caseId}</span>
        <span className="text-xs text-ink-3">{item.region}</span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green">
          <TrendingUp />
          매칭 {item.matchingScore}%
        </span>
        <span
          className={`ml-auto text-xs font-medium ${due.urgent ? "text-terra" : "text-ink-3"}`}
        >
          {due.label}
        </span>
      </div>

      <p className="mt-2 text-[14px] font-semibold text-ink">{item.title}</p>

      <Link
        href={`/partner/review/${item.reportId}`}
        className={buttonVariants({ variant: "outline", size: "sm", full: true, className: "mt-3" })}
      >
        검수하기
      </Link>
    </div>
  );
}
