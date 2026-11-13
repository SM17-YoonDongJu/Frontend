"use client";

import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewBoundary } from "./ReviewBoundary";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewStatusTabs } from "./ReviewStatusTabs";
import { ReviewTypeChips } from "./ReviewTypeChips";

export function ReviewView() {
  const { type, setType, status, setStatus } = useReviewFilter();

  return (
    <>
      <ReviewHeader />
      <ReviewStatusTabs value={status} onSelect={setStatus} />
      <ReviewTypeChips value={type} onSelect={setType} />
      <ReviewBoundary />
    </>
  );
}
