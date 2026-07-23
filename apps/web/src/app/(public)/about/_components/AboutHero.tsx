import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { PublicPageHero } from "../../_shared/_components/PublicPageHero";

export function AboutHero() {
  return (
    <PublicPageHero
      kicker="손해사정 매칭 플랫폼"
      kickerIcon={<ShieldCheck className="size-[0.9375rem] text-gold-ink" />}
      title="받은 보험금, 혼자 판단하지 마세요"
      subtitle="보험금 산정에는 정보 비대칭이 있습니다. 바른보상은 약관·특약·판례를 분석해 예상 보상 범위와 쟁점을 리포트로 정리하고, 필요할 때 손해사정사로 연결합니다."
    >
      <Link href="/login" className={buttonVariants({ variant: "primary", size: "lg" })}>
        내 보상 분석하기
        <ArrowRight className="size-[1.1875rem]" />
      </Link>
      <Link href="/guide" className={buttonVariants({ variant: "outline", size: "lg" })}>
        이용 방법 보기
      </Link>
    </PublicPageHero>
  );
}
