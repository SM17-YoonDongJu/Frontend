"use client";

import { useState } from "react";
import { useReviewList } from "../../_shared/api/use-review-list";
import { useReviewStatusCounts } from "../../_shared/api/use-review-status-counts";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { DesktopReviewCaseList } from "./DesktopReviewCaseList";
import { ReviewDraftPanel } from "./ReviewDraftPanel";
import { ReviewEmpty } from "./ReviewEmpty";
import { ReviewFilterBar } from "./ReviewFilterBar";
import { ReviewStatusTabs } from "./ReviewStatusTabs";
import { ReviewSummaryCards } from "./ReviewSummaryCards";

export function DesktopReviewView() {
  const { type, status, setStatus, region } = useReviewFilter();
  const accidentType = type === "전체" ? undefined : type;
  const statusFilter = status === "전체" ? undefined : status;
  const regionParam = region === "전체" ? undefined : region;

  // 지역 드롭다운 옵션은 지역 필터를 적용하지 않은 목록에서 파생(지역 선택 시 옵션 붕괴 방지).
  const { data: optionsData } = useReviewList({ status: statusFilter, accidentType });
  const { data } = useReviewList({ status: statusFilter, accidentType, region: regionParam });
  const { data: statusCounts } = useReviewStatusCounts();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const regions = [
    ...new Set(optionsData.list.map((item) => item.region).filter((r): r is string => !!r)),
  ];
  const selected =
    data.list.find((item) => item.reportId === selectedId) ?? data.list[0] ?? null;

  return (
    <div className="space-y-6">
      <ReviewSummaryCards />
      <ReviewStatusTabs value={status} counts={statusCounts} onSelect={setStatus} />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_24.5rem]">
        <div className="space-y-5">
          <ReviewFilterBar regions={regions} />

          {data.list.length === 0 ? (
            <ReviewEmpty activeType={type} activeStatus={status} />
          ) : (
            <DesktopReviewCaseList
              items={data.list}
              selectedId={selected?.reportId ?? null}
              onSelect={setSelectedId}
            />
          )}
        </div>

        <ReviewDraftPanel item={selected} />
      </div>
    </div>
  );
}
