"use client";

import { useReviewList } from "../_api/use-review-list";
import { ReviewEmpty } from "./ReviewEmpty";
import { ReviewSummaryCards } from "./ReviewSummaryCards";

export function ReviewView() {
  const { data } = useReviewList({ status: "AWAITING_INSPECTION" });

  return (
    <div className="space-y-6">
      <ReviewSummaryCards />

      {data.list.length === 0 ? (
        <ReviewEmpty />
      ) : (
        <ul className="space-y-3">
          {data.list.map((item) => (
            <li
              key={item.reportId}
              className="rounded-card-lg border border-line bg-card px-5 py-4 text-sm text-ink"
            >
              {item.accidentType}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
