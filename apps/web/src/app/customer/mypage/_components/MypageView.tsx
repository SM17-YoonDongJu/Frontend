"use client";

import { useEffect, useRef, useState } from "react";
import { useMe } from "@/shared/api/use-me";
import { usePanelParam } from "@/shared/lib/use-panel-param";
import { ContactAccountCard } from "./ContactAccountCard";
import { InsuranceSection } from "./InsuranceSection";
import { MobileMypageView } from "./mobile/MobileMypageView";
import { MypageSidebar } from "./MypageSidebar";
import { NotificationSettingsCard } from "./NotificationSettingsCard";
import { ProfileHero } from "./ProfileHero";
import { ProfileSettingsModal } from "./ProfileSettingsModal";
import { ProfileSettingsSheet } from "./mobile/ProfileSettingsSheet";
import { SectionBoundary } from "./SectionBoundary";
import { SectionSkeleton } from "./SectionSkeleton";

/** PC 2컬럼 + 모바일 스택 오케스트레이터. 프로필(필수)은 상위 경계에서 suspend. */
export function MypageView() {
  const { data: profile } = useMe();
  const [editOpen, setEditOpen] = useState(false);
  const openEdit = () => setEditOpen(true);
  const closeEdit = () => setEditOpen(false);

  // 알림 팝오버의 "알림 설정" 진입 — 인라인 카드라 열 모달이 없어 카드로 이동시킨다.
  const { panel, clearPanel } = usePanelParam();
  const notificationCardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (panel !== "notifications") return;
    notificationCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    notificationCardRef.current?.focus({ preventScroll: true });
    clearPanel();
  }, [panel, clearPanel]);

  return (
    <>
      <div className="hidden md:grid md:grid-cols-[14.75rem_minmax(0,1fr)] md:items-start md:gap-7">
        <SectionBoundary
          errorTitle="메뉴를 불러오지 못했어요"
          fallback={<SectionSkeleton className="h-60" />}
        >
          <MypageSidebar />
        </SectionBoundary>

        <div className="flex flex-col gap-5.5">
          <ProfileHero profile={profile} onEdit={openEdit} />

          <div className="grid grid-cols-2 items-start gap-5.5">
            <ContactAccountCard profile={profile} onEdit={openEdit} />
            <NotificationSettingsCard ref={notificationCardRef} />
          </div>

          <SectionBoundary
            errorTitle="보험 정보를 불러오지 못했어요"
            fallback={<SectionSkeleton className="h-88" />}
          >
            <InsuranceSection />
          </SectionBoundary>
        </div>
      </div>

      <div className="md:hidden">
        <MobileMypageView profile={profile} onEdit={openEdit} />
      </div>

      <div className="hidden md:block">
        <ProfileSettingsModal open={editOpen} profile={profile} onClose={closeEdit} />
      </div>
      <div className="md:hidden">
        <ProfileSettingsSheet open={editOpen} profile={profile} onClose={closeEdit} />
      </div>
    </>
  );
}
