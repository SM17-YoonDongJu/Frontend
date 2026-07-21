import type { ReactNode } from "react";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { ONBOARDING_STEPS_ANCHOR } from "./onboarding-anchors";

interface OnboardingStep {
  order: string;
  title: string;
  badge?: string;
  description: string;
}

const STEPS: OnboardingStep[] = [
  {
    order: "1",
    title: "분석 신청",
    badge: "약 5분",
    description: "사고·치료 내용과 가입한 보험 정보를 입력해요. 서류가 없어도 아는 만큼만 적으면 돼요.",
  },
  {
    order: "2",
    title: "전문가 검수",
    description: "손해사정사가 내용을 검토하고 보상 가능성을 진단해요. 검수 결과는 리포트로 받아볼 수 있어요.",
  },
  {
    order: "3",
    title: "제안 비교·매칭",
    description: "여러 사정사의 제안(예상 보상액·수수료)을 비교하고, 마음에 드는 분과 상담을 시작해요.",
  },
];

export function OnboardingSteps() {
  return (
    <section id={ONBOARDING_STEPS_ANCHOR} className="scroll-mt-24">
      <h2 className="text-center font-serif text-[1.4375rem] font-bold text-ink">이렇게 진행돼요</h2>
      <p className="mt-2 text-center text-sm text-ink-3">신청부터 매칭까지, 세 단계면 충분해요.</p>

      <ol className="mt-[1.375rem] grid gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.order}
            className="relative rounded-card border border-line bg-card px-[1.6875rem] py-[1.8125rem]"
          >
            <span className="flex size-[2.125rem] items-center justify-center rounded-full bg-gold-soft font-serif text-[0.9375rem] font-bold text-gold-ink">
              {step.order}
            </span>

            <h3 className="mt-4 flex items-center gap-2 text-[1.0625rem] font-bold text-ink">
              {step.title}
              {step.badge && (
                <span className="rounded-tag bg-gold-soft px-2 py-[0.125rem] text-xs font-semibold text-gold-ink">
                  {step.badge}
                </span>
              )}
            </h3>

            <p className="mt-[0.5625rem] text-[0.84375rem] leading-[1.65] text-ink-2">
              {step.description}
            </p>

            {index < STEPS.length - 1 && <StepConnector />}
          </li>
        ))}
      </ol>
    </section>
  );
}

function StepConnector(): ReactNode {
  return (
    <span
      aria-hidden
      className="absolute -right-2 top-1/2 z-10 hidden size-[1.625rem] -translate-y-1/2 items-center justify-center rounded-input border border-line bg-paper-2 text-ink-3 md:flex"
    >
      <ChevronRight className="text-[0.8125rem]" />
    </span>
  );
}
