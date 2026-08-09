"use client";

import { useAdjusterHome } from "../_api/use-home";
import { SectionCard } from "./SectionCard";
import { InProgressEmpty } from "./InProgressEmpty";
import { InProgressRow } from "./InProgressRow";

export function InProgressCases() {
  const { data } = useAdjusterHome();
  const { items } = data.inProgressCases;

  return (
    <SectionCard title="진행 중 사건">
      {items.length === 0 ? (
        <InProgressEmpty />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.reportId}>
              <InProgressRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
