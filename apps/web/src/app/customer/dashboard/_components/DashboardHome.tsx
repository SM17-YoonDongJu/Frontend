"use client";

import { useDashboard } from "../_api/use-dashboard";
import { DashboardDesktopView } from "./DashboardDesktopView";
import { MobileHomeView } from "./mobile/MobileHomeView";
import { OnboardingHomeView } from "./onboarding/OnboardingHomeView";

export function DashboardHome() {
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
