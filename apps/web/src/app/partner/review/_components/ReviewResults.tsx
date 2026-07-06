"use client";

import { useReviewList } from "../_api/use-review-list";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewCaseList } from "./ReviewCaseList";
import { ReviewEmpty } from "./ReviewEmpty";

export function ReviewResults() {
  const { type } = useReviewFilter();
  const accidentType = type === "전체" ? undefined : type;

  const { data } = useReviewList({ status: "AWAITING_INSPECTION", accidentType });

  if (data.list.length === 0) {
    return <ReviewEmpty activeType={type} />;
  }

  return <ReviewCaseList items={data.list} />;
}
