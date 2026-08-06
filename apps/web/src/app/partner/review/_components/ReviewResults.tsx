"use client";

import { useReviewList } from "../../_shared/api/use-review-list";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewCaseList } from "./ReviewCaseList";
import { ReviewEmpty } from "./ReviewEmpty";

export function ReviewResults() {
  const { type, status, statusValues } = useReviewFilter();
  const accidentType = type === "전체" ? undefined : type;
  // 백엔드가 status 다중값을 못 받아 프리셋(다중)은 전체를 받아 클라이언트 필터링.
  const statusFilter = statusValues?.length === 1 ? statusValues[0] : undefined;

  const { data } = useReviewList({ status: statusFilter, accidentType });
  const items = statusValues && statusValues.length > 1
    ? data.list.filter((item) => !!item.status && statusValues.includes(item.status))
    : data.list;

  if (items.length === 0) {
    return <ReviewEmpty activeType={type} activeStatus={status} />;
  }

  return <ReviewCaseList items={items} />;
}
