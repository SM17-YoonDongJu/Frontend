"use client";

import Link from "next/link";
import { Chevron } from "@/shared/ui/icons/Chevron";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { useInProgressCases } from "../_api/use-in-progress";
import type { InProgressCase } from "../_model/types";
import { IN_PROGRESS_STATUS_META } from "../_model/in-progress-status";
import { SectionCard } from "./SectionCard";
import { InProgressEmpty } from "./InProgressEmpty";

export function InProgressCases() {
  const { data } = useInProgressCases();

  return (
    <SectionCard title="진행 중 사건" description="검수·고객 검토가 진행 중인 사건이에요.">
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
          <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          <span className="text-[14px] font-semibold text-ink">{item.accidentType}</span>
          <span className="text-xs text-ink-3">#{item.caseId}</span>
        </div>
        <Chevron />
      </div>

      <p className="mt-1.5 text-[13px] text-ink-2">{item.description}</p>

      <div className="mt-3 flex items-center gap-3">
        <ProgressBar
          value={item.progress}
          max={100}
          tone={meta.tone}
          label={`${meta.label} 진행`}
        />
        <span className="shrink-0 text-xs font-semibold tabular-nums text-ink-2">
          {item.progress}%
        </span>
      </div>
    </Link>
  );
}
