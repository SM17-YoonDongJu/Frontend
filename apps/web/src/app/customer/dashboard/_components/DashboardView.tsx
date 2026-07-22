"use client";

import { useDashboard } from "../_api/use-dashboard";
import { DashboardDesktopView } from "./DashboardDesktopView";
import { SectionBoundary } from "./SectionBoundary";
import { SectionSkeleton } from "./SectionSkeleton";
import { MobileHomeView } from "./mobile/MobileHomeView";
import { OnboardingHomeView } from "./onboarding/OnboardingHomeView";

export function DashboardView() {
  return (
    <SectionBoundary
      errorTitle="홈 화면을 불러오지 못했어요"
      fallback={<SectionSkeleton height="30rem" />}
    >
      <DashboardHome />
    </SectionBoundary>
  );
}

function DashboardHome() {
  const { data } = useDashboard();

  if (data.reportCount === 0) {
    return <OnboardingHomeView />;
  }

  return (
    <>
      <div className="hidden md:block">
        <DashboardDesktopView />
      </div>
      <MobileHomeView />
    </>
  );
}
