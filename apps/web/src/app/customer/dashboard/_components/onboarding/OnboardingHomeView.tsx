import { SectionBoundary } from "../SectionBoundary";
import { SectionSkeleton } from "../SectionSkeleton";
import { OnboardingAdjusters } from "./OnboardingAdjusters";
import { OnboardingCtaBand } from "./OnboardingCtaBand";
import { OnboardingFaq } from "./OnboardingFaq";
import { OnboardingHero } from "./OnboardingHero";
import { OnboardingSteps } from "./OnboardingSteps";

export function OnboardingHomeView() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <SectionBoundary fallback={<SectionSkeleton height="20rem" />}>
        <OnboardingHero />
      </SectionBoundary>

      <OnboardingSteps />

      <div className="grid gap-5 lg:grid-cols-[1.75fr_1fr]">
        <SectionBoundary errorTitle="사정사 정보를 불러오지 못했어요">
          <OnboardingAdjusters />
        </SectionBoundary>
        <OnboardingFaq />
      </div>

      <OnboardingCtaBand />
    </div>
  );
}
