"use client";

import { useState } from "react";
import { useReviewList } from "../_api/use-review-list";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewCaseList } from "./ReviewCaseList";
import { ReviewDraftPanel } from "./ReviewDraftPanel";
import { ReviewEmpty } from "./ReviewEmpty";
import { ReviewFilterBar } from "./ReviewFilterBar";
import { ReviewSummaryCards } from "./ReviewSummaryCards";

export function ReviewView() {
  const { type, region } = useReviewFilter();
  const { data } = useReviewList({
    status: "AWAITING_INSPECTION",
    accidentType: type === "전체" ? undefined : type,
    region: region === "전체" ? undefined : region,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const regions = [
    ...new Set(data.list.map((item) => item.region).filter((r): r is string => !!r)),
  ];
  const selected = data.list.find((item) => item.reportId === selectedId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <ReviewSummaryCards />
        <ReviewFilterBar regions={regions} />

        {data.list.length === 0 ? (
          <ReviewEmpty />
        ) : (
          <ReviewCaseList items={data.list} selectedId={selectedId} onSelect={setSelectedId} />
        )}
      </div>

      <ReviewDraftPanel item={selected} />
    </div>
  );
}
