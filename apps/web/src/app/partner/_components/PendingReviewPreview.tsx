"use client";

import { useReviewList } from "../_shared/api/use-review-list";
import { SectionCard } from "./SectionCard";
import { PendingReviewEmpty } from "./PendingReviewEmpty";
import { PendingReviewRow } from "./PendingReviewRow";

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
