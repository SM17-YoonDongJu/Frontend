import type { ReviewListItem } from "../../_shared/model/types";
import { DesktopReviewCaseCard } from "./DesktopReviewCaseCard";

interface Props {
  items: ReviewListItem[];
  selectedId: string | null;
  onSelect: (reportId: string) => void;
}

export function DesktopReviewCaseList({ items, selectedId, onSelect }: Props) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.reportId}>
          <DesktopReviewCaseCard
            item={item}
            selected={selectedId === item.reportId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
