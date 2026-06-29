"use client";

import { useProfile } from "../_api/use-profile";

export function DashboardGreeting() {
  const { data, isPending } = useProfile();

  if (isPending) {
    return (
      <div className="space-y-2">
        <div className="h-7 w-64 animate-pulse rounded-pill bg-line-2" />
        <div className="h-5 w-80 animate-pulse rounded-pill bg-line-2" />
      </div>
    );
  }

  const greeting = data ? `안녕하세요, ${data.nickname} 사정님` : "안녕하세요";
  const pendingCount = data?.pendingReviewCount ?? 0;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">{greeting}</h1>
      <p className="mt-1 text-[15px] text-ink-2">
        {pendingCount > 0
          ? `오늘 검수 대기 중인 사건이 ${pendingCount}건 있어요.`
          : "오늘 검수 대기 중인 사건이 없어요."}
      </p>
    </div>
  );
}
