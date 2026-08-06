import Link from "next/link";
import type { Me } from "../../_model/types";
import { SectionBoundary } from "../SectionBoundary";
import { SectionSkeleton } from "../SectionSkeleton";
import { ActivityList } from "./ActivityList";
import { InProgressAnalysisCard } from "./InProgressAnalysisCard";
import { MobileLogout } from "./MobileLogout";
import { MobileMypageHeader } from "./MobileMypageHeader";
import { MobileProfileCard } from "./MobileProfileCard";
import { MobileStats } from "./MobileStats";
import { PartnerSwitchSection } from "./PartnerSwitchSection";
import { SettingsList } from "./SettingsList";

interface MobileMypageViewProps {
  profile: Me;
  onEdit: () => void;
}

/** 모바일 세로 스택 오케스트레이터. */
export function MobileMypageView({ profile, onEdit }: MobileMypageViewProps) {
  return (
    <div className="flex flex-col gap-6 px-5.5 pb-10 pt-1">
      <MobileMypageHeader />

      <MobileProfileCard profile={profile} onEdit={onEdit}>
        <SectionBoundary
          errorTitle="활동 정보를 불러오지 못했어요"
          fallback={<div className="h-18 animate-pulse bg-white/10" />}
        >
          <MobileStats />
        </SectionBoundary>
      </MobileProfileCard>

      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-[0.8125rem] font-bold text-ink-2">진행 중인 분석</h2>
          <Link
            href="/customer/dashboard"
            className="text-[0.75rem] font-bold text-ink-3 transition hover:text-ink-2"
          >
            전체 보기
          </Link>
        </div>
        <SectionBoundary
          errorTitle="진행 중인 분석을 불러오지 못했어요"
          fallback={<SectionSkeleton className="h-52" />}
        >
          <InProgressAnalysisCard />
        </SectionBoundary>
      </section>

      <SectionBoundary
        errorTitle="보상 활동을 불러오지 못했어요"
        fallback={<SectionSkeleton className="h-56" />}
      >
        <ActivityList />
      </SectionBoundary>

      <SectionBoundary
        errorTitle="설정을 불러오지 못했어요"
        fallback={<SectionSkeleton className="h-56" />}
      >
        <SettingsList />
      </SectionBoundary>

      <PartnerSwitchSection role={profile.role} />

      <MobileLogout />
    </div>
  );
}
