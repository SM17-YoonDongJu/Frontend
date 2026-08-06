"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { MypageSkeleton } from "./MypageSkeleton";
import { MypageView } from "./MypageView";

/** 프로필(필수 쿼리) 상위 경계. 섹션별 쿼리는 각 SectionBoundary가 독립 처리. */
export function MypageBoundary() {
  return (
    <AsyncBoundary
      fallback={<MypageSkeleton />}
      errorLayout="card"
      errorTitle="내 정보를 불러오지 못했어요"
    >
      <MypageView />
    </AsyncBoundary>
  );
}
