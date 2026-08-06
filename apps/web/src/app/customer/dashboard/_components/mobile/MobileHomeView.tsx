import { ActionCenterCard } from "../ActionCenterCard";
import { AdjusterRecommendCard } from "../AdjusterRecommendCard";
import { AnalysisTimelineCard } from "../AnalysisTimelineCard";
import { GreetingHeader } from "../GreetingHeader";
import { ProposalCompareCard } from "../ProposalCompareCard";
import { SectionBoundary } from "../SectionBoundary";
import { SectionSkeleton } from "../SectionSkeleton";
import { MobileQuickActions } from "./MobileQuickActions";

export function MobileHomeView() {
  return (
    <div className="-mx-6 -my-10 flex min-h-dvh flex-col gap-3.5 bg-paper px-5 pb-16 pt-4 md:hidden">
      <SectionBoundary fallback={<SectionSkeleton height="3.5rem" />}>
        <GreetingHeader />
      </SectionBoundary>

      <SectionBoundary
        errorTitle="지금 할 일을 불러오지 못했어요"
        fallback={<SectionSkeleton height="13rem" />}
      >
        <ActionCenterCard />
      </SectionBoundary>

      <SectionBoundary errorTitle="진행 중인 분석을 불러오지 못했어요">
        <AnalysisTimelineCard />
      </SectionBoundary>

      <SectionBoundary errorTitle="받은 제안을 불러오지 못했어요">
        <ProposalCompareCard />
      </SectionBoundary>

      <MobileQuickActions />

      <SectionBoundary errorTitle="추천 사정사를 불러오지 못했어요">
        <AdjusterRecommendCard />
      </SectionBoundary>
    </div>
  );
}
