import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";
import { ReportHistoryCard } from "./ReportHistoryCard";
import { CustomerReportsEmpty } from "./CustomerReportsEmpty";

interface Props {
  items: ReportListItem[];
  /** 전체 리포트 수(필터 무관 아님 — 현재 필터 결과의 총계). 0이면 "데이터 없음" 분기. */
  totalCount: number;
  hasActiveFilter: boolean;
  onResetFilter: () => void;
}

export function CustomerReportsList({ items, totalCount, hasActiveFilter, onResetFilter }: Props) {
  if (items.length === 0) {
    if (totalCount === 0 && !hasActiveFilter) return <CustomerReportsEmpty variant="no-data" />;
    if (hasActiveFilter) {
      return (
        <CustomerReportsEmpty variant="no-filter-result" onResetFilter={onResetFilter} />
      );
    }
    return <CustomerReportsEmpty variant="no-data" />;
  }

  return (
    <ul className="flex flex-col gap-3 px-5 pt-3 pb-5">
      {items.map((item) => (
        <li key={item.reportId}>
          <ReportHistoryCard item={item} />
        </li>
      ))}
    </ul>
  );
}
