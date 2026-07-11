import { REVIEW_STATUS_OPTIONS } from "./ReviewStatusTabs";
import { REVIEW_TYPE_OPTIONS } from "./ReviewTypeChips";

export function ReviewEmpty({ activeType, activeStatus }: { activeType: string; activeStatus: string }) {
  const typeLabel = REVIEW_TYPE_OPTIONS.find((option) => option.value === activeType)?.label;
  const statusLabel = REVIEW_STATUS_OPTIONS.find((option) => option.value === activeStatus)?.label;
  const filterLabel = [
    activeStatus !== "전체" ? statusLabel : undefined,
    activeType !== "전체" ? typeLabel : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col items-center px-5 py-24 text-center">
      <h2 className="text-[1.125rem] font-semibold text-ink">
        {filterLabel ? `${filterLabel} 케이스가 없어요` : "검수 대기 케이스가 없어요"}
      </h2>
      <p className="mt-2 text-[0.875rem] text-ink-3">
        {filterLabel
          ? "다른 상태나 유형을 선택하거나 잠시 후 다시 확인해 주세요."
          : "새 케이스가 접수되면 여기에 표시돼요."}
      </p>
    </div>
  );
}
