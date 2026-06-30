"use client";

import Link from "next/link";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { useInProgressCases } from "../_api/use-in-progress";
import type { InProgressCase } from "../_model/types";
import { IN_PROGRESS_STATUS_META } from "../_model/in-progress-status";
import { SectionCard } from "./SectionCard";
import { InProgressEmpty } from "./InProgressEmpty";

const STATUS_TEXT = {
  gold: "text-gold-ink",
  green: "text-green",
  navy: "text-navy",
} as const;

export function InProgressCases() {
  const { data } = useInProgressCases();

  return (
    <SectionCard title="진행 중 사건">
      {data.list.length === 0 ? (
        <InProgressEmpty />
      ) : (
        <ul className="space-y-3">
          {data.list.map((item) => (
            <li key={item.reportId}>
              <InProgressRow item={item} />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

function InProgressRow({ item }: { item: InProgressCase }) {
  const meta = IN_PROGRESS_STATUS_META[item.status];

  return (
    <Link
      href={`/partner/review/${item.reportId}`}
      className="block rounded-card border border-line bg-card px-4 py-3.5 transition hover:border-gold"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="gold">{item.accidentType}</StatusBadge>
          <span className="text-xs text-ink-3">#{item.caseId}</span>
        </div>
        <span className={`shrink-0 text-[13px] font-semibold ${STATUS_TEXT[meta.tone]}`}>
          {meta.label}
        </span>
      </div>

      <p className="mt-2 text-[14px] font-medium text-ink">{item.description}</p>

      <ProgressBar
        value={item.progress}
        max={100}
        tone={meta.tone}
        label={`${meta.label} 진행`}
        className="mt-3"
      />
    </Link>
  );
}
