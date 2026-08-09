"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReviewList } from "../_shared/api/use-review-list";
import { PendingReviewEmpty } from "./PendingReviewEmpty";
import { MobilePendingCard } from "./MobilePendingCard";

export function MobilePendingList() {
  const { data } = useReviewList({ status: "AWAITING_INSPECTION" });
  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setNavigatingId(null);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    if (navigatingId === null) return;
    const timeout = setTimeout(() => setNavigatingId(null), 5000);
    return () => clearTimeout(timeout);
  }, [navigatingId]);

  const sorted = data.list.toSorted(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section className="space-y-2.5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[0.9375rem] font-bold text-ink">
          검수 대기 <span className="text-gold-ink">{data.list.length}</span>
        </h2>
        <Link href="/partner/review" className="text-[0.8125rem] text-ink-3">
          전체보기
        </Link>
      </div>

      {sorted.length === 0 ? (
        <PendingReviewEmpty />
      ) : (
        <ul className="space-y-2.5">
          {sorted.map((item) => (
            <li key={item.reportId}>
              <MobilePendingCard
                item={item}
                navigatingId={navigatingId}
                onNavigate={setNavigatingId}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
