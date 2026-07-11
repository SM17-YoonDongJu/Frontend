"use client";

import { useEffect, useState } from "react";
import { useMypage } from "../_api/use-mypage";
import { useMypagePanel } from "../_hooks/use-mypage-panel";
import { CredentialProofModal } from "./CredentialProofModal";
import { LogoutButton } from "./LogoutButton";
import { MonthlyActivityCard } from "./MonthlyActivityCard";
import { MypageMenuList } from "./MypageMenuList";
import { NotificationSettingsModal } from "./NotificationSettingsModal";
import { ProfileSummaryCard } from "./ProfileSummaryCard";
import { StatCards } from "./StatCards";

export function MypageView() {
  const { data } = useMypage();
  const { panel, clearPanel } = useMypagePanel();
  const [notificationOpen, setNotificationOpen] = useState(panel === "notifications");
  const [credentialOpen, setCredentialOpen] = useState(false);

  useEffect(() => {
    if (panel === "notifications") setNotificationOpen(true);
  }, [panel]);

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

      <div className="mt-5.5 grid grid-cols-1 items-start gap-5.5 md:grid-cols-[minmax(0,1fr)_21.25rem] md:gap-7">
        <div className="order-2 md:order-1">
          <MypageMenuList
            reviewCount={data.stats.totalCompletedCount}
            onNotificationClick={() => setNotificationOpen(true)}
            onCredentialClick={() => setCredentialOpen(true)}
          />
        </div>
        <div className="order-1 md:order-2">
          <MonthlyActivityCard activity={data.monthlyActivity} />
        </div>
      </div>

      <div className="mt-4">
        <LogoutButton />
      </div>

      <NotificationSettingsModal
        open={notificationOpen}
        onClose={() => {
          setNotificationOpen(false);
          if (panel === "notifications") clearPanel();
        }}
      />
      <CredentialProofModal
        open={credentialOpen}
        licenseNo={data.certification.licenseNo}
        onClose={() => setCredentialOpen(false)}
      />
    </div>
  );
}
