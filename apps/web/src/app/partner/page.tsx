import { DashboardGreeting } from "./_components/DashboardGreeting";
import { SummaryCardsBoundary } from "./_components/SummaryCardsBoundary";
import { PendingReviewBoundary } from "./_components/PendingReviewBoundary";
import { InProgressBoundary } from "./_components/InProgressBoundary";
import { ActivityBoundary } from "./_components/ActivityBoundary";
import { PartnerModeBanner } from "./_components/PartnerModeBanner";
import { MobileGreeting } from "./_components/MobileGreeting";
import { MobileSummaryBoundary } from "./_components/MobileSummaryBoundary";
import { MobilePendingBoundary } from "./_components/MobilePendingBoundary";

export default function PartnerDashboardPage() {
  return (
    <>
      <div className="space-y-4 px-5 py-5 md:hidden">
        <PartnerModeBanner />
        <MobileGreeting />
        <MobileSummaryBoundary />
        <MobilePendingBoundary />
      </div>

      <div className="mx-auto hidden w-full max-w-6xl px-6 py-8 md:block">
        <DashboardGreeting />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <SummaryCardsBoundary />
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <PendingReviewBoundary />
            <InProgressBoundary />
          </div>
          <ActivityBoundary />
        </div>
      </div>
    </>
  );
}
