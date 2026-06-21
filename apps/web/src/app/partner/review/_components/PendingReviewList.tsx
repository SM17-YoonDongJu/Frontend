"use client";

import { useState } from "react";
import { usePendingReviews } from "../_api/use-pending-reviews";
import { PendingReviewCard } from "./PendingReviewCard";
import { PendingReviewError } from "./PendingReviewError";
import { PendingReviewFilter } from "./PendingReviewFilter";
import { PendingReviewSkeleton } from "./PendingReviewSkeleton";

export function PendingReviewList() {
  const [status, setStatus] = useState("");
  const query = usePendingReviews(status ? { status } : undefined);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <h1 className="font-serif text-[24px] font-bold text-ink">검수 대기</h1>
      <p className="mt-1.5 text-[14px] text-ink-3">
        배정된 손해사정 리포트를 검토하고 고객에게 전송하세요.
      </p>

      <div className="mt-5">
        <PendingReviewFilter value={status} onChange={setStatus} />
      </div>

      <div className="mt-6">
        {query.isPending ? (
          <PendingReviewSkeleton />
        ) : query.isError ? (
          <PendingReviewError onRetry={() => query.refetch()} />
        ) : query.data.list.length === 0 ? (
          <div className="rounded-card-lg border border-line bg-card px-6 py-16 text-center text-[14px] text-ink-3">
            검수 대기 중인 리포트가 없습니다.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.list.map((item) => (
              <li key={item.reportId}>
                <PendingReviewCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
