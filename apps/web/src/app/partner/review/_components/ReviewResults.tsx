"use client";

import { useReviewList } from "../../_shared/api/use-review-list";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewCaseList } from "./ReviewCaseList";
import { ReviewEmpty } from "./ReviewEmpty";

export function ReviewResults() {
  const { type, status } = useReviewFilter();
  const accidentType = type === "전체" ? undefined : type;
  const statusFilter = status === "전체" ? undefined : status;

  const { data } = useReviewList({ status: statusFilter, accidentType });

  if (data.list.length === 0) {
    return <ReviewEmpty activeType={type} activeStatus={status} />;
  }

  return <ReviewCaseList items={data.list} />;
}
