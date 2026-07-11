"use client";

import Link from "next/link";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { buttonVariants } from "@/shared/ui/Button";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { useReviewList } from "../_shared/api/use-review-list";
import type { ReviewListItem } from "../_shared/model/types";
import { SectionCard } from "./SectionCard";
import { PendingReviewEmpty } from "./PendingReviewEmpty";

const PREVIEW_LIMIT = 3;

export function PendingReviewPreview() {
  const { data } = useReviewList({ status: "AWAITING_INSPECTION" });

  const top = data.list.slice(0, PREVIEW_LIMIT);

  return (
    <SectionCard
      title="검수 대기"
      count={`${data.list.length}건`}
      action={{ label: "전체 보기", href: "/partner/review" }}
    >
      {top.length === 0 ? (
        <PendingReviewEmpty />
      ) : (
        <ul className="-my-1 divide-y divide-line">
          {top.map((item) => (
            <li key={item.reportId} className="py-3.5 first:pt-0 last:pb-0">
              <PendingReviewRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

function PendingReviewRow({ item }: { item: ReviewListItem }) {
  return (
    <div className="flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="gold">{accidentTypeLabel(item.accidentType)}</StatusBadge>
          {item.caseId && <span className="text-xs text-ink-3">#{item.caseId}</span>}
          {item.region && <span className="text-xs text-ink-3">· {item.region}</span>}
        </div>
        <p className="mt-1.5 truncate text-[0.875rem] font-semibold text-ink">
          {item.title ?? accidentTypeLabel(item.accidentType)}
        </p>
      </div>

      <Link
        href={`/partner/review/${item.reportId}`}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        검수
      </Link>
    </div>
  );
}
