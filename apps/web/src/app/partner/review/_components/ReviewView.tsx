"use client";

import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewBoundary } from "./ReviewBoundary";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewTypeChips } from "./ReviewTypeChips";

export function ReviewView() {
  const { type, setType } = useReviewFilter();

  return (
    <>
      <ReviewHeader />
      <ReviewTypeChips value={type} onSelect={setType} />
      <ReviewBoundary />
    </>
  );
}
