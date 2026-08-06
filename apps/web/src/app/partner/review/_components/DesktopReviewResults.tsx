"use client";

import { useState } from "react";
import { useReviewList } from "../../_shared/api/use-review-list";
import { useReviewFilter } from "../_hooks/use-review-filter";
import { DesktopReviewCaseList } from "./DesktopReviewCaseList";
import { ReviewDraftPanel } from "./ReviewDraftPanel";
import { ReviewEmpty } from "./ReviewEmpty";
import { ReviewFilterBar } from "./ReviewFilterBar";

export function DesktopReviewResults() {
  const { type, status, statusValues, region } = useReviewFilter();
  const accidentType = type === "전체" ? undefined : type;
  // 백엔드가 status 다중값을 못 받아 프리셋(다중)은 전체를 받아 클라이언트 필터링.
  const statusFilter = statusValues?.length === 1 ? statusValues[0] : undefined;
  const regionParam = region === "전체" ? undefined : region;

  // 지역 드롭다운 옵션은 지역 필터를 적용하지 않은 목록에서 파생(지역 선택 시 옵션 붕괴 방지).
  const { data: optionsData } = useReviewList({ status: statusFilter, accidentType });
  const { data: rawData } = useReviewList({ status: statusFilter, accidentType, region: regionParam });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const data = {
    ...rawData,
    list:
      statusValues && statusValues.length > 1
        ? rawData.list.filter((item) => !!item.status && statusValues.includes(item.status))
        : rawData.list,
  };

  const regions = [
    ...new Set(optionsData.list.map((item) => item.region).filter((r): r is string => !!r)),
  ];
  const selected =
    data.list.find((item) => item.reportId === selectedId) ?? data.list[0] ?? null;

  return (
    <div className="space-y-6">
      <ReviewFilterBar regions={regions} />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_24.5rem]">
        {data.list.length === 0 ? (
          <ReviewEmpty activeType={type} activeStatus={status} />
        ) : (
          <DesktopReviewCaseList
            items={data.list}
            selectedId={selected?.reportId ?? null}
            onSelect={setSelectedId}
          />
        )}

        <ReviewDraftPanel item={selected} />
      </div>
    </div>
  );
}
