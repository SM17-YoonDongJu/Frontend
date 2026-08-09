import { ActionCenterCard } from "./ActionCenterCard";
import { AdjusterRecommendCard } from "./AdjusterRecommendCard";
import { AnalysisTimelineCard } from "./AnalysisTimelineCard";
import { GreetingHeader } from "./GreetingHeader";
import { MyReportsSection } from "./MyReportsSection";
import { ProposalCompareCard } from "./ProposalCompareCard";
import { SectionBoundary } from "./SectionBoundary";
import { SectionSkeleton } from "./SectionSkeleton";

export function DashboardDesktopView() {
  return (
    <div className="flex flex-col gap-8">
      <SectionBoundary fallback={<SectionSkeleton height="4rem" />}>
        <GreetingHeader />
      </SectionBoundary>

      <SectionBoundary
        errorTitle="지금 할 일을 불러오지 못했어요"
        fallback={<SectionSkeleton height="13rem" />}
      >
        <ActionCenterCard />
      </SectionBoundary>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <SectionBoundary errorTitle="진행 중인 분석을 불러오지 못했어요">
            <AnalysisTimelineCard />
          </SectionBoundary>
          <SectionBoundary errorTitle="받은 제안을 불러오지 못했어요">
            <ProposalCompareCard />
          </SectionBoundary>
        </div>

        <div className="lg:w-[21.25rem] lg:shrink-0">
          <SectionBoundary errorTitle="추천 사정사를 불러오지 못했어요">
            <AdjusterRecommendCard />
          </SectionBoundary>
        </div>
      </div>

      <SectionBoundary errorTitle="내 리포트를 불러오지 못했어요">
        <MyReportsSection />
      </SectionBoundary>
    </div>
  );
}
