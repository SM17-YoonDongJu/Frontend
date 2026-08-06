import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { PublicPageHero } from "../../_shared/_components/PublicPageHero";

export function GuideHero() {
  return (
    <PublicPageHero
      kicker="이용 방법"
      title="분석부터 상담까지, 네 단계"
      subtitle="정보를 입력하면 AI 분석과 전문가 검수를 거쳐 리포트가 만들어지고, 필요할 때 손해사정사 상담으로 이어집니다."
    >
      <Link href="/login" className={buttonVariants({ variant: "primary", size: "lg" })}>
        분석 신청하기
        <ArrowRight className="size-[1.1875rem]" />
      </Link>
    </PublicPageHero>
  );
}
