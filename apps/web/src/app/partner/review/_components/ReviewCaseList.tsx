import type { ReviewListItem } from "../../_shared/model/types";
import { ReviewCaseCard } from "./ReviewCaseCard";

interface Props {
  items: ReviewListItem[];
}

export function ReviewCaseList({ items }: Props) {
  return (
    <ul className="flex flex-col gap-3 px-5 pt-3">
      {items.map((item) => (
        <li key={item.reportId}>
          <ReviewCaseCard item={item} />
        </li>
      ))}
    </ul>
  );
}
