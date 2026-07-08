import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { DASHBOARD_LINKS } from "@/app/customer/dashboard/_model/dashboard-links";

export function MobileHeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-card-lg bg-navy px-[1.375rem] py-6 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-7 left-[16.125rem] size-[8.125rem] rounded-full border border-white/[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[13.875rem] top-2 size-[8.125rem] rounded-full border border-white/[0.06]"
      />

      <div className="relative">
        <p className="text-[0.75rem] font-bold text-gold-2">보상 분석</p>
        <h2 className="mt-2.5 font-serif text-[1.5rem] font-bold leading-8 text-white">
          받은 보험금,
          <br />
          적정한지 확인하세요
        </h2>
        <p className="mt-3 text-[0.8125rem] leading-4 text-white/60">
          약관·특약·판례를 분석해 예상 보상 범위와
          <br />
          쟁점을 리포트로 정리해드려요.
        </p>
        <Link
          href={DASHBOARD_LINKS.newAnalysis}
          className={buttonVariants({ variant: "gold", size: "md", className: "mt-4 w-fit" })}
        >
          새 분석 시작
          <ArrowRight className="text-[1.0625rem]" />
        </Link>
      </div>
    </section>
  );
}
