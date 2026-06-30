"use client";

import { useProfile } from "../_api/use-profile";

export function DashboardGreeting() {
  const { data, isPending } = useProfile();

  if (isPending) {
    return (
      <div className="space-y-2">
        <div className="h-8 w-72 animate-pulse rounded-pill bg-line-2" />
        <div className="h-5 w-96 animate-pulse rounded-pill bg-line-2" />
      </div>
    );
  }

  const greeting = data ? `안녕하세요, ${data.nickname} 사정님` : "안녕하세요";
  const pendingCount = data?.pendingReviewCount ?? 0;

  return (
    <div>
      <h1 className="font-serif text-[28px] font-bold text-ink">{greeting}</h1>
      {pendingCount > 0 ? (
        <p className="mt-1.5 text-[14px] text-ink-3">
          오늘 검수 대기 중인 사건이 <span className="font-semibold text-ink">{pendingCount}건</span>{" "}
          있어요. 전문분야 매칭이 높은 순으로 정리해뒀습니다.
        </p>
      ) : (
        <p className="mt-1.5 text-[14px] text-ink-3">오늘 검수 대기 중인 사건이 없어요.</p>
      )}
    </div>
  );
}
