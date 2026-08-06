"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { MypageSkeleton } from "./MypageSkeleton";
import { MypageView } from "./MypageView";

export function MypageBoundary() {
  return (
    <AsyncBoundary
      fallback={<MypageSkeleton />}
      errorLayout="card"
      errorTitle="내 정보를 불러오지 못했어요"
      errorClassName="mt-5.5"
    >
      <MypageView />
    </AsyncBoundary>
  );
}
