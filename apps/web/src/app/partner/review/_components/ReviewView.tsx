"use client";

import { useState } from "react";
import { useReviewList } from "../_api/use-review-list";
import { ReviewCaseList } from "./ReviewCaseList";
import { ReviewEmpty } from "./ReviewEmpty";
import { ReviewSummaryCards } from "./ReviewSummaryCards";

export function ReviewView() {
  const { data } = useReviewList({ status: "AWAITING_INSPECTION" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <ReviewSummaryCards />

      {data.list.length === 0 ? (
        <ReviewEmpty />
      ) : (
        <ReviewCaseList items={data.list} selectedId={selectedId} onSelect={setSelectedId} />
      )}
    </div>
  );
}
