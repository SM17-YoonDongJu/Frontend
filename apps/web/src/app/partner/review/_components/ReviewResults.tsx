"use client";

import { useMemo } from "react";
import { useReviewListInfinite } from "../_api/use-review-list-infinite";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewCaseList } from "./ReviewCaseList";
import { ReviewEmpty } from "./ReviewEmpty";
import { ReviewLoadMoreButton } from "./ReviewLoadMoreButton";

export function ReviewResults() {
  const { type, status, statusFilter, accidentTypeFilter } = useReviewFilter();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useReviewListInfinite({
    status: statusFilter,
    accidentType: accidentTypeFilter,
  });
  const items = useMemo(() => data.pages.flatMap((page) => page.list), [data.pages]);

  if (items.length === 0) {
    return <ReviewEmpty activeType={type} activeStatus={status} />;
  }

  return (
    <>
      <ReviewCaseList items={items} />
      {hasNextPage && (
        <ReviewLoadMoreButton
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="px-5 pt-3 pb-6"
        />
      )}
    </>
  );
}
