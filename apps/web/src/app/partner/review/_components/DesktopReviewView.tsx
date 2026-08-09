"use client";

import { useReviewStatusCounts } from "../../_shared/api/use-review-status-counts";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { DesktopReviewFilterSection } from "./DesktopReviewFilterSection";
import { ReviewStatusTabs } from "./ReviewStatusTabs";
import { ReviewSummaryCards } from "./ReviewSummaryCards";

export function DesktopReviewView() {
  const { status, setStatus, isPending } = useReviewFilter();
  const { data: statusCounts } = useReviewStatusCounts();

  return (
    <div className="space-y-6">
      <ReviewSummaryCards />
      <ReviewStatusTabs value={status} counts={statusCounts} onSelect={setStatus} isPending={isPending} />
      <DesktopReviewFilterSection />
    </div>
  );
}
