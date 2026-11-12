"use client";

import { useMemo, useState } from "react";
import { useReviewListInfinite } from "../_api/use-review-list-infinite";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { DesktopReviewCaseList } from "./DesktopReviewCaseList";
import { ReviewDraftPanel } from "./ReviewDraftPanel";
import { ReviewEmpty } from "./ReviewEmpty";
import { ReviewFilterBar } from "./ReviewFilterBar";
import { ReviewLoadMoreButton } from "./ReviewLoadMoreButton";

export function DesktopReviewResults() {
  const { type, status, statusFilter, accidentTypeFilter, regionFilter } = useReviewFilter();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useReviewListInfinite({
    status: statusFilter,
    accidentType: accidentTypeFilter,
    region: regionFilter,
  });
  const items = useMemo(() => data.pages.flatMap((page) => page.list), [data.pages]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = items.find((item) => item.reportId === selectedId) ?? items[0] ?? null;

  return (
    <div className="space-y-6">
      <ReviewFilterBar />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_24.5rem]">
        {items.length === 0 ? (
          <ReviewEmpty activeType={type} activeStatus={status} />
        ) : (
          <div className="space-y-4">
            <DesktopReviewCaseList
              items={items}
              selectedId={selected?.reportId ?? null}
              onSelect={setSelectedId}
            />
            {hasNextPage && (
              <ReviewLoadMoreButton
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              />
            )}
          </div>
        )}

        <ReviewDraftPanel item={selected} />
      </div>
    </div>
  );
}
