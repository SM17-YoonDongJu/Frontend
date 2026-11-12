"use client";

import { useReviewFilter } from "../_hooks/use-review-filter";
import { DesktopReviewFilterSection } from "./DesktopReviewFilterSection";
import { ReviewStatusTabs } from "./ReviewStatusTabs";
import { ReviewSummaryCards } from "./ReviewSummaryCards";

export function DesktopReviewView() {
  const { status, setStatus, isPending } = useReviewFilter();

  return (
    <div className="space-y-6">
      <ReviewSummaryCards />
      <ReviewStatusTabs value={status} onSelect={setStatus} isPending={isPending} />
      <DesktopReviewFilterSection />
    </div>
  );
}
