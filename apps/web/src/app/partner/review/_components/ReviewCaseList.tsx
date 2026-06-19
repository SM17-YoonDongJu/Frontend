import type { ReviewListItem } from "../_model/types";
import { ReviewCaseCard } from "./ReviewCaseCard";

interface Props {
  items: ReviewListItem[];
  selectedId: string | null;
  onSelect: (reportId: string) => void;
}

export function ReviewCaseList({ items, selectedId, onSelect }: Props) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.reportId}>
          <ReviewCaseCard
            item={item}
            selected={selectedId === item.reportId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
