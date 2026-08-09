"use client";

import { cn } from "@/shared/lib/utils";
import { useActivitySummary } from "../../_api/use-activity-summary";

/** 모바일 3분할 스탯 — 분석 리포트 / 받은 제안(강조 gold) / 종결. navy 카드 내부 다크 테마. */
export function MobileStats() {
  const { data: counts } = useActivitySummary();

  const items = [
    { label: "분석 리포트", value: counts.reportCount, emphasis: false },
    { label: "받은 제안", value: counts.proposalCount, emphasis: true },
    { label: "종결", value: counts.closedCount, emphasis: false },
  ];

  return (
    <dl className="grid grid-cols-3 divide-x divide-white/10">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1 py-4">
          <dd
            className={cn(
              "font-serif text-[1.4375rem] font-bold",
              item.emphasis ? "text-gold-2" : "text-white",
            )}
          >
            {item.value}
          </dd>
          <dt className="text-[0.75rem] text-white/60">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}
