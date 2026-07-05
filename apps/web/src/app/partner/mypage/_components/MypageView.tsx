"use client";

import { useMypage } from "../_api/use-mypage";
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

      <div className="mt-5.5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCards
          stats={data.stats}
          monthlyCompletedCount={data.monthlyActivity.completedCount}
        />
      </div>
    </div>
  );
}
