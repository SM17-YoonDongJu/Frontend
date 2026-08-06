import type { Metadata } from "next";
import { PublicCtaBand } from "../_shared/_components/PublicCtaBand";
import { FaqList } from "./_components/FaqList";
import { FlowSteps } from "./_components/FlowSteps";
import { GuideHero } from "./_components/GuideHero";

export const metadata: Metadata = {
  title: "이용 방법",
  description:
    "분석 신청부터 AI 분석·전문가 검수, 리포트 확인, 손해사정사 상담·매칭까지. 바른보상 이용 흐름을 단계별로 안내합니다."
};

export default function GuidePage() {
  return (
    <>
      <GuideHero />
      <FlowSteps />
      <FaqList />
      <PublicCtaBand
        title="5분이면 시작할 수 있어요"
        subtitle="지금 분석을 신청해 보세요."
        ctaLabel="분석 신청하기"
        ctaHref="/login"
      />
    </>
  );
}
