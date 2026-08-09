import Link from "next/link";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { buttonVariants } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import type { ReviewListItem } from "../_shared/model/types";

export function PendingReviewRow({ item }: { item: ReviewListItem }) {
  return (
    <div className="flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="gold">{accidentTypeLabel(item.accidentType)}</StatusBadge>
          {item.caseId && <span className="text-xs text-ink-3">#{item.caseId}</span>}
          {item.region && <span className="text-xs text-ink-3">· {item.region}</span>}
        </div>
        <p className="mt-1.5 truncate text-[0.875rem] font-semibold text-ink">
          {item.title ?? accidentTypeLabel(item.accidentType)}
        </p>
      </div>

      <Link
        href={`/partner/review/${item.reportId}`}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        검수
      </Link>
    </div>
  );
}
