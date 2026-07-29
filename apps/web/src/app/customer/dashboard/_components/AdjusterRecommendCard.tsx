"use client";

import Link from "next/link";
import { getInitial } from "@/shared/lib/initial";
import { useRecommendedAdjusters } from "@/app/customer/_shared/api/use-recommended-adjusters";
import type { AdjusterListItem } from "@/app/customer/_shared/model/adjuster-list.schema";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";

const RECOMMEND_COUNT = 3;

export function AdjusterRecommendCard() {
  const adjusters = useRecommendedAdjusters().slice(0, RECOMMEND_COUNT);

  return (
    <section className="rounded-card border border-line bg-card p-[1.5625rem]">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">이런 사정사는 어때요?</h2>
        <Link
          href={DASHBOARD_LINKS.adjusterFinder}
          className="text-[0.8125rem] font-medium text-ink-3 transition hover:text-ink-2"
        >
          둘러보기 ›
        </Link>
      </header>

      <ul className="mt-2 divide-y divide-line-2">
        {adjusters.map((adjuster) => (
          <AdjusterRecommendRow key={adjuster.adjusterId} adjuster={adjuster} />
        ))}
      </ul>
    </section>
  );
}

function AdjusterRecommendRow({ adjuster }: { adjuster: AdjusterListItem }) {
  const specialty = adjuster.specialties[0];

  return (
    <li>
      <Link
        href={`/customer/adjusters/${adjuster.adjusterId}`}
        className="flex items-center gap-3 py-3 transition hover:opacity-80"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-[0.8125rem] font-bold text-gold-ink">
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
            경력 {adjuster.career}년 · 매칭 {adjuster.completedConsultCount}건
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-ink-2">
          ★ {adjuster.averageRating.toFixed(1)}
        </span>
      </Link>
    </li>
  );
}
