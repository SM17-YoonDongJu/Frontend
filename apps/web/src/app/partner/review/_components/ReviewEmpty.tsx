import { REVIEW_TYPE_OPTIONS } from "./ReviewTypeChips";

export function ReviewEmpty({ activeType }: { activeType: string }) {
  const filtered = activeType !== "전체";
  const label = REVIEW_TYPE_OPTIONS.find((option) => option.value === activeType)?.label;

  return (
    <div className="flex flex-col items-center px-5 py-24 text-center">
      <h2 className="text-[1.125rem] font-semibold text-ink">
        {filtered && label ? `${label} 검수 대기 케이스가 없어요` : "검수 대기 케이스가 없어요"}
      </h2>
      <p className="mt-2 text-[0.875rem] text-ink-3">
        {filtered ? "다른 유형을 선택하거나 잠시 후 다시 확인해 주세요." : "새 케이스가 접수되면 여기에 표시돼요."}
      </p>
    </div>
  );
}
