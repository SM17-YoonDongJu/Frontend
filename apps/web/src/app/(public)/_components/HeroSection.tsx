import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { ReportPreviewCard } from "./ReportPreviewCard";

/**
 * PC 히어로. 좌측 카피·CTA + 우측 미리보기 카드.
 */
export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-14 py-20">
      <div className="flex items-center justify-between gap-12">
        <div className="w-[36.75rem]">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-[0.5rem] bg-gold-soft px-3">
            <ShieldCheck className="size-[0.9375rem] text-gold-ink" />
            <span className="text-[0.8125rem] font-bold text-gold-ink">보험 보상 분석 리포트</span>
          </span>

          <h1 className="mt-5 whitespace-pre-line font-serif text-[3.5rem] font-bold leading-[4.125rem] text-ink">
            {"받은 보험금,\n적정한 금액일까요?"}
          </h1>

          <p className="mt-6 max-w-[30rem] text-[1.125rem] leading-[1.6875rem] text-ink-2">
            약관·특약·판례를 분석해 예상 보상 범위와 주요 쟁점을 리포트로 정리합니다. 필요할 땐 독립
            손해사정사로 바로 연결됩니다.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <Link href="/login" className={buttonVariants({ variant: "primary", size: "lg" })}>
              내 보상 분석하기
              <ArrowRight className="size-[1.1875rem]" />
            </Link>
            <Link
              href="#how-it-works"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              이용 방법 보기
            </Link>
          </div>
        </div>

        <ReportPreviewCard />
      </div>
    </section>
  );
}
