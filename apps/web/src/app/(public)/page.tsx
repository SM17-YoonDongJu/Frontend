import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CtaBandSection } from "./_components/CtaBandSection";
import { HeroSection } from "./_components/HeroSection";
import { HowItWorksSection } from "./_components/HowItWorksSection";
import { LandingRedirectGate } from "./_components/LandingRedirectGate";
import { MobileFeatureCards } from "./_components/MobileFeatureCards";
import { MobileHero } from "./_components/MobileHero";
import { ReportTypesSection } from "./_components/ReportTypesSection";

/** 온보딩(랜딩) 페이지. md↑ PC 시안 / md↓ 모바일 시안(문구가 다른 별도 변형). */
export default function HomePage() {
  return (
    <LandingRedirectGate>
      <div className="hidden md:block">
        <HeroSection />
        <HowItWorksSection />
        <ReportTypesSection />
        <CtaBandSection />
      </div>

      <div className="md:hidden">
        <MobileHero />
        <MobileFeatureCards />
        <div className="flex flex-col gap-3 px-6 pb-10 pt-8">
          <Link
            href="/login"
            className={buttonVariants({ variant: "primary", size: "lg", full: true })}
          >
            무료로 분석 시작하기
            <ArrowRight className="size-[1.1875rem]" />
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost", size: "md", full: true })}
          >
            손해사정사로 활동하기
          </Link>
        </div>
      </div>
    </LandingRedirectGate>
  );
}
