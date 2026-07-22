"use client";

import Link from "next/link";
import { useMe } from "@/shared/api/use-me";
import { DASHBOARD_LINKS } from "../../_model/dashboard-links";
import { ONBOARDING_STEPS_ANCHOR } from "./onboarding-anchors";

export function OnboardingHero() {
  const { data: me } = useMe();

  return (
    <section className="relative overflow-hidden rounded-card-lg bg-navy px-6 py-14 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 right-24 hidden size-80 rounded-full bg-gold-2/10 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-64 hidden size-72 rounded-full border border-gold-2/25 md:block"
      />

      <div className="relative flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-gold-2/15 px-3 py-[0.3125rem]">
          <span className="size-1.5 rounded-[0.1875rem] bg-gold-2" />
          <span className="text-xs font-semibold text-gold-2">
            첫 방문을 환영해요, {me.nickname}님
          </span>
        </span>

        <h1 className="mt-4 font-serif text-[2rem] font-bold leading-[1.45] text-white md:text-[2.125rem]">
          받을 수 있는 보험금,
          <br />
          <span className="text-gold-2">제대로</span> 받고 계신가요?
        </h1>

        <p className="mt-3.5 text-[0.9375rem] leading-[1.7] text-white/65">
          사고·질병 내용을 남기면 전문 손해사정사가 검수하고,
          <br className="hidden md:block" /> 여러 명의 제안을 비교해 나에게 맞는 보상 파트너를 찾아드려요.
        </p>

        <div className="mt-6 flex w-full flex-col justify-center gap-3 md:w-auto md:flex-row">
          <Link
            href={DASHBOARD_LINKS.newAnalysis}
            className="inline-flex items-center justify-center rounded-button bg-gold px-[1.875rem] py-[0.9375rem] text-[0.9375rem] font-semibold text-white transition hover:brightness-[.96]"
          >
            5분 만에 첫 분석 시작
          </Link>
          <a
            href={`#${ONBOARDING_STEPS_ANCHOR}`}
            className="inline-flex items-center justify-center rounded-button border border-white/18 bg-white/8 px-[1.6875rem] py-4 text-[0.9375rem] font-semibold text-white transition hover:bg-white/14"
          >
            진행 과정 알아보기
          </a>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          <TrustChip label="매칭 전 비용" highlight="0원" />
          <TrustChip label="여러 제안" highlight="한눈에 비교" />
        </div>
      </div>
    </section>
  );
}

function TrustChip({ label, highlight }: { label: string; highlight: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-white/12 bg-white/6 px-3.5 py-2">
      <span className="text-[0.78125rem] font-medium text-white/78">{label}</span>
      <span className="text-[0.78125rem] font-semibold text-gold-2">{highlight}</span>
    </span>
  );
}
