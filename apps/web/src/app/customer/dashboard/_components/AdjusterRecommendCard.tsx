"use client";

import Link from "next/link";
import { useRecommendedAdjusters } from "@/app/customer/_shared/api/use-recommended-adjusters";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import { AdjusterEmpty } from "./AdjusterEmpty";
import { AdjusterRecommendRow } from "./AdjusterRecommendRow";

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

      {adjusters.length === 0 ? (
        <div className="mt-4">
          <AdjusterEmpty />
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-line-2">
          {adjusters.map((adjuster) => (
            <AdjusterRecommendRow key={adjuster.adjusterId} adjuster={adjuster} />
          ))}
        </ul>
      )}
    </section>
  );
}
