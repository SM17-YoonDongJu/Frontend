export type ReviewHistoryEmptyVariant = "no-data" | "no-filter-result";

const EMPTY_COPY: Record<ReviewHistoryEmptyVariant, { title: string; desc: string }> = {
  "no-data": {
    title: "아직 검수한 내역이 없어요",
    desc: "검수를 완료하면 이곳에서 지난 내역을 확인할 수 있어요.",
  },
  "no-filter-result": {
    title: "이 조건의 검수 내역이 없어요",
    desc: "다른 필터를 선택하거나 전체 내역을 확인해 보세요.",
  },
};

interface Props {
  variant: ReviewHistoryEmptyVariant;
  onResetFilter?: () => void;
}

export function ReviewHistoryEmpty({ variant, onResetFilter }: Props) {
  const copy = EMPTY_COPY[variant];

  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <h2 className="text-[0.9375rem] font-semibold text-ink">{copy.title}</h2>
      <p className="mt-2 text-[0.8125rem] text-ink-3">{copy.desc}</p>
      {variant === "no-filter-result" && onResetFilter && (
        <button
          type="button"
          onClick={onResetFilter}
          className="mt-5 rounded-button border border-line bg-card px-4 py-2 text-[0.8125rem] font-semibold text-ink-2 transition hover:brightness-[.98]"
        >
          전체 내역 보기
        </button>
      )}
    </div>
  );
}
