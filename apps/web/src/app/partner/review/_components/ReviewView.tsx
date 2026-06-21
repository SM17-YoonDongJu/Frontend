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
  const { data } = useReviewList({ status: "AWAITING_INSPECTION" });
  const { type, region } = useReviewFilter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const regions = [...new Set(data.list.map((item) => item.region))];
  const filtered = data.list.filter(
    (item) =>
      (type === "전체" || item.accidentType === type) &&
      (region === "전체" || item.region === region),
  );
  const selected = data.list.find((item) => item.reportId === selectedId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <ReviewSummaryCards />
        <ReviewFilterBar regions={regions} />

        {filtered.length === 0 ? (
          <ReviewEmpty />
        ) : (
          <ReviewCaseList items={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        )}
      </div>

      <ReviewDraftPanel item={selected} />
    </div>
  );
}
