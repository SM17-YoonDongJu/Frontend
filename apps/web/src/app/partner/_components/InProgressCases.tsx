"use client";

import Link from "next/link";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { useAdjusterHome } from "../_api/use-home";
import type { HomeInProgressCase } from "../_model/types";
import { SectionCard } from "./SectionCard";
import { InProgressEmpty } from "./InProgressEmpty";

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

function InProgressRow({ item }: { item: HomeInProgressCase }) {
  const tone = item.progressPercent >= 100 ? "green" : "gold";
  const toneText = tone === "green" ? "text-green" : "text-gold-ink";

  return (
    <Link
      href={`/partner/review/${item.reportId}`}
      className="block rounded-card border border-line bg-card px-4 py-3.5 transition hover:border-gold"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="gold">{item.accidentType}</StatusBadge>
          <span className="text-xs text-ink-3">#{item.caseNo}</span>
        </div>
        <span className={`shrink-0 text-[0.8125rem] font-semibold ${toneText}`}>
          {item.stageLabel}
        </span>
      </div>

      <p className="mt-2 text-[0.875rem] font-medium text-ink">{item.title}</p>

      <ProgressBar
        value={item.progressPercent}
        max={100}
        tone={tone}
        label={`${item.stageLabel} 진행`}
        className="mt-3"
      />
    </Link>
  );
}
