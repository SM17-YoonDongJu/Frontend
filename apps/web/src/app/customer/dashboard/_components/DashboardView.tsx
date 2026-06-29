"use client";

import { ViewedReviewsProvider } from "../_hooks/use-viewed-reviews";
import { DashboardBanner } from "./DashboardBanner";
import { MyReportsSection } from "./MyReportsSection";
import { ReceivedProposalsCard } from "./ReceivedProposalsCard";
import { ReviewCompleteCard } from "./ReviewCompleteCard";
import { SectionBoundary } from "./SectionBoundary";
import { SectionSkeleton } from "./SectionSkeleton";

export function DashboardView() {
  return (
    <ViewedReviewsProvider>
      <div className="flex flex-col gap-8">
        <SectionBoundary
          errorTitle="진행 현황을 불러오지 못했어요"
          fallback={<SectionSkeleton height="13rem" />}
        >
          <DashboardBanner />
        </SectionBoundary>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="lg:flex-[1.4]">
            <SectionBoundary errorTitle="내 리포트를 불러오지 못했어요">
              <MyReportsSection />
            </SectionBoundary>
          </div>

          <div className="flex flex-col gap-8 lg:flex-1">
            <SectionBoundary errorTitle="검수 완료 알림을 불러오지 못했어요">
              <ReviewCompleteCard />
            </SectionBoundary>
            <SectionBoundary errorTitle="받은 제안을 불러오지 못했어요">
              <ReceivedProposalsCard />
            </SectionBoundary>
          </div>
        </div>
      </div>
    </ViewedReviewsProvider>
  );
}
