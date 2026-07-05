"use client";

import { useMypage } from "../_api/use-mypage";
import { LogoutButton } from "./LogoutButton";
import { MonthlyActivityCard } from "./MonthlyActivityCard";
import { MypageMenuList } from "./MypageMenuList";
import { ProfileSummaryCard } from "./ProfileSummaryCard";
import { StatCards } from "./StatCards";

export function MypageView() {
  const { data } = useMypage();

  return (
    <div className="mt-5.5">
      <ProfileSummaryCard
        profile={data.profile}
        licenseNo={data.certification.licenseNo}
      />

      <div className="mt-5.5 grid grid-cols-3 gap-2.5 md:gap-4">
        <StatCards
          stats={data.stats}
          monthlyCompletedCount={data.monthlyActivity.completedCount}
        />
      </div>

      <div className="mt-5.5 grid grid-cols-1 items-start gap-5.5 md:grid-cols-3 md:gap-7">
        <div className="order-2 md:order-1 md:col-span-2">
          <MypageMenuList reviewCount={data.stats.totalCompletedCount} />
        </div>
        <div className="order-1 md:order-2">
          <MonthlyActivityCard activity={data.monthlyActivity} />
        </div>
      </div>

      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
