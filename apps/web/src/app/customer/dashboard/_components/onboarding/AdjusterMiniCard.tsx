import Link from "next/link";
import { getInitial } from "@/shared/lib/initial";
import type { AdjusterListItem } from "@/app/customer/_shared/model/adjuster-list.schema";

export function AdjusterMiniCard({
  adjuster,
  hiddenOnMobile,
}: {
  adjuster: AdjusterListItem;
  hiddenOnMobile: boolean;
}) {
  const specialty = adjuster.specialties[0];

  return (
    <li className={hiddenOnMobile ? "hidden md:block" : undefined}>
      <Link
        href={`/customer/adjusters/${adjuster.adjusterId}`}
        className="flex items-center gap-3 rounded-input border border-line-2 bg-paper-2 p-[1.0625rem] transition hover:brightness-[.98]"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold-soft text-sm font-bold text-gold-ink">
          {getInitial(adjuster.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-ink">{adjuster.name}</span>
            {specialty && (
              <span className="shrink-0 rounded-tag bg-line-2 px-1.5 py-0.5 text-[0.6875rem] font-medium text-ink-2">
                {specialty}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-ink-3">
            경력 {adjuster.career}년 · 매칭 {adjuster.completedConsultCount}건 · ★{" "}
            {adjuster.averageRating.toFixed(1)}
          </p>
        </div>
      </Link>
    </li>
  );
}
