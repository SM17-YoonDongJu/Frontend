import { SectionBoundary } from "../SectionBoundary";
import { SectionSkeleton } from "../SectionSkeleton";
import { MobileAdjusterFinder } from "./MobileAdjusterFinder";
import { MobileGreetingHeader } from "./MobileGreetingHeader";
import { MobileHeroBanner } from "./MobileHeroBanner";
import { MobileQuickActions } from "./MobileQuickActions";
import { MobileRecentReport } from "./MobileRecentReport";

export function MobileHomeView() {
  return (
    <div className="-mx-6 -my-10 flex min-h-dvh flex-col gap-6 bg-paper px-5 pb-16 pt-4 md:hidden">
      <SectionBoundary fallback={<SectionSkeleton height="3.5rem" />}>
        <MobileGreetingHeader />
      </SectionBoundary>

      <MobileHeroBanner />

      <SectionBoundary
        errorTitle="최근 리포트를 불러오지 못했어요"
        fallback={<SectionSkeleton height="15.5rem" />}
      >
        <MobileRecentReport />
      </SectionBoundary>

      <MobileQuickActions />

      <MobileAdjusterFinder />
    </div>
  );
}
