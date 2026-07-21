import Link from "next/link";
import { DASHBOARD_LINKS } from "../../_model/dashboard-links";

export function OnboardingCtaBand() {
  return (
    <section className="flex flex-col items-start gap-5 rounded-card-lg border border-line bg-paper-2 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-[2.5625rem] md:py-[2.1875rem]">
      <div>
        <h2 className="font-serif text-[1.3125rem] font-bold leading-[1.5] text-ink">
          지금 신청하면 검수 결과를
          <br />
          리포트로 받아볼 수 있어요
        </h2>
        <p className="mt-[0.4375rem] text-sm text-ink-3">
          작성 중간에 저장돼요. 부담 없이 시작해 보세요.
        </p>
      </div>

      <Link
        href={DASHBOARD_LINKS.newAnalysis}
        className="inline-flex w-full items-center justify-center rounded-button bg-ink px-7 py-[0.9375rem] text-[0.9375rem] font-semibold text-white transition hover:brightness-[.96] md:w-auto"
      >
        첫 분석 시작하기
      </Link>
    </section>
  );
}
