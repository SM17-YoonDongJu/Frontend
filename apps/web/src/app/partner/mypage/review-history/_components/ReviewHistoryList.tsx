import { ReviewedCaseCard } from "./ReviewedCaseCard";
import { ReviewHistoryEmpty } from "./ReviewHistoryEmpty";
import type { ReviewedReportItem } from "../_model/types";

interface Props {
  items: ReviewedReportItem[];
  /** 전체 검수 이력 수(필터 무관). 0이면 "이력 자체 없음"으로 분기. */
  totalCount: number;
  hasActiveFilter: boolean;
  onResetFilter: () => void;
}

export function ReviewHistoryList({ items, totalCount, hasActiveFilter, onResetFilter }: Props) {
  if (items.length === 0) {
    if (totalCount === 0) return <ReviewHistoryEmpty variant="no-data" />;
    return (
      <ReviewHistoryEmpty
        variant={hasActiveFilter ? "no-filter-result" : "no-data"}
        onResetFilter={onResetFilter}
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3 px-5 pt-3 pb-5">
      {items.map((item) => (
        <li key={item.caseId}>
          <ReviewedCaseCard item={item} />
        </li>
      ))}
    </ul>
  );
}
