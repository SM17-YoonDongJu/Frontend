"use client";

import Link from "next/link";
import { useRecommendedAdjusters } from "@/app/customer/_shared/api/use-recommended-adjusters";
import { DASHBOARD_LINKS } from "../../_model/dashboard-links";
import { AdjusterEmpty } from "../AdjusterEmpty";
import { AdjusterMiniCard } from "./AdjusterMiniCard";

const MOBILE_VISIBLE_COUNT = 3;

export function OnboardingAdjusters() {
  const adjusters = useRecommendedAdjusters();

  return (
    <section className="flex h-full flex-col rounded-card border border-line bg-card p-[1.6875rem]">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">어떤 사정사가 함께하나요?</h2>
        <Link
          href={DASHBOARD_LINKS.adjusterFinder}
          className="text-[0.8125rem] font-medium text-ink-3 transition hover:text-ink-2"
        >
          전체 둘러보기 ›
        </Link>
      </header>

      {adjusters.length === 0 ? (
        <div className="mt-4 flex-1">
          <AdjusterEmpty />
        </div>
      ) : (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {adjusters.map((adjuster, index) => (
            <AdjusterMiniCard
              key={adjuster.adjusterId}
              adjuster={adjuster}
              hiddenOnMobile={index >= MOBILE_VISIBLE_COUNT}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
