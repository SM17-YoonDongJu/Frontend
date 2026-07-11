"use client";

import { useReviewStatusCounts } from "../../_shared/api/use-review-status-counts";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewBoundary } from "./ReviewBoundary";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewStatusTabs } from "./ReviewStatusTabs";
import { ReviewTypeChips } from "./ReviewTypeChips";

export function ReviewView() {
  const { type, setType, status, setStatus } = useReviewFilter();
  const { data: statusCounts } = useReviewStatusCounts();

  return (
    <>
      <ReviewHeader />
      <ReviewStatusTabs value={status} counts={statusCounts} onSelect={setStatus} />
      <ReviewTypeChips value={type} onSelect={setType} />
      <ReviewBoundary />
    </>
  );
}
