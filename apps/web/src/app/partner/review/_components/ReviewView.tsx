"use client";

import { useState } from "react";
import { useReviewList } from "../_api/use-review-list";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { ReviewCaseList } from "./ReviewCaseList";
import { ReviewDraftPanel } from "./ReviewDraftPanel";
import { ReviewEmpty } from "./ReviewEmpty";
import { ReviewFilterBar } from "./ReviewFilterBar";
import { ReviewSummaryCards } from "./ReviewSummaryCards";

export function ReviewView() {
  const { type, region } = useReviewFilter();
  const accidentType = type === "전체" ? undefined : type;
  const regionParam = region === "전체" ? undefined : region;

  // 지역 드롭다운 옵션은 지역 필터를 적용하지 않은 목록에서 파생(지역 선택 시 옵션 붕괴 방지).
  const { data: optionsData } = useReviewList({ status: "AWAITING_INSPECTION", accidentType });
  const { data } = useReviewList({
    status: "AWAITING_INSPECTION",
    accidentType,
    region: regionParam,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const regions = [
    ...new Set(optionsData.list.map((item) => item.region).filter((r): r is string => !!r)),
  ];
  const selected = data.list.find((item) => item.reportId === selectedId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <ReviewSummaryCards />
        <ReviewFilterBar regions={regions} />

        {data.list.length === 0 ? (
          <ReviewEmpty />
        ) : (
          <ReviewCaseList items={data.list} selectedId={selectedId} onSelect={setSelectedId} />
        )}
      </div>

      <ReviewDraftPanel item={selected} />
    </div>
  );
}
