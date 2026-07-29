"use client";

import Link from "next/link";
import { getInitial } from "@/shared/lib/initial";
import { useRecommendedAdjusters } from "@/app/customer/_shared/api/use-recommended-adjusters";
import type { AdjusterListItem } from "@/app/customer/_shared/model/adjuster-list.schema";
import { DASHBOARD_LINKS } from "../../_model/dashboard-links";

const MOBILE_VISIBLE_COUNT = 3;

export function OnboardingAdjusters() {
  const adjusters = useRecommendedAdjusters();

  return (
    <section className="rounded-card border border-line bg-card p-[1.6875rem]">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">어떤 사정사가 함께하나요?</h2>
        <Link
          href={DASHBOARD_LINKS.adjusterFinder}
          className="text-[0.8125rem] font-medium text-ink-3 transition hover:text-ink-2"
        >
          전체 둘러보기 ›
        </Link>
      </header>

      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {adjusters.map((adjuster, index) => (
          <AdjusterMiniCard
            key={adjuster.adjusterId}
            adjuster={adjuster}
            hiddenOnMobile={index >= MOBILE_VISIBLE_COUNT}
          />
        ))}
      </ul>
    </section>
  );
}

function AdjusterMiniCard({
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
