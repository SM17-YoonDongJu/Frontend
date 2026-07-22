import type { Metadata } from "next";
import { PublicCtaBand } from "../_shared/_components/PublicCtaBand";
import { AboutHero } from "./_components/AboutHero";
import { ProblemSection } from "./_components/ProblemSection";
import { TrustSection } from "./_components/TrustSection";
import { ValuePropSection } from "./_components/ValuePropSection";

export const metadata: Metadata = {
  title: "서비스 소개",
  description:
    "받은 보험금이 적정한지 약관·특약·판례로 분석하고, 필요할 때 손해사정사로 연결하는 손해사정 매칭 플랫폼 바른보상 소개."
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ProblemSection />
      <ValuePropSection />
      <TrustSection />
      <PublicCtaBand
        title="지금, 내 보상부터 확인하세요"
        subtitle="참고용 분석은 무료입니다."
        ctaLabel="내 보상 분석하기"
        ctaHref="/login"
      />
    </>
  );
}
