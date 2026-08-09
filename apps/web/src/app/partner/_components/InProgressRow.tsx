import Link from "next/link";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { inProgressStageIndex, inProgressStatusMeta } from "../_model/in-progress-status-meta";
import type { HomeInProgressCase } from "../_model/types";
import { InProgressStageTracker } from "./InProgressStageTracker";

export function InProgressRow({ item }: { item: HomeInProgressCase }) {
  const status = inProgressStatusMeta(item);
  const stageIndex = inProgressStageIndex(item);

  return (
    <Link
      href={`/partner/review/${item.reportId}`}
      className="block rounded-card border border-line bg-card px-4 py-3.5 transition hover:border-gold"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-3">#{item.caseNo}</span>
          <span className="text-xs text-ink-3">{accidentTypeLabel(item.accidentType)}</span>
        </div>
        <StatusBadge tone={status.tone} className="shrink-0">
          {status.label}
        </StatusBadge>
      </div>

      <p className="mt-2 text-[0.875rem] font-medium text-ink">{item.title}</p>

      <InProgressStageTracker currentIndex={stageIndex} />
    </Link>
  );
}
