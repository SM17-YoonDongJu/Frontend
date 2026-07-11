import { Check } from "@/shared/ui/icons/Check";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";

const CONSUMER_ITEMS = [
  "적용 가능 보장 항목과 지급 조건",
  "누락 가능 특약 안내",
  "“약 000원~000원” 예상 보상 범위"
];

const EXPERT_ITEMS = [
  "관련 약관 조항 원문 인용",
  "청구 항목 체크리스트 + 필요 서류",
  "장해지급률 추정 계산"
];

/**
 * PC 두 가지 리포트 섹션(계약자용 · 손해사정사용).
 */
export function ReportTypesSection() {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-14 py-20">
      <p className="text-center text-[0.875rem] font-bold text-gold-ink">두 가지 리포트</p>
      <h2 className="mt-[0.8125rem] text-center font-serif text-[2.375rem] font-bold text-ink">
        계약자에게도, 전문가에게도
      </h2>

      <div className="mt-[3.25rem] grid grid-cols-2 gap-6">
        <div className="rounded-[1.125rem] border border-line bg-card p-8">
          <span className="inline-flex h-6 items-center rounded-pill bg-gold-soft px-2.5 text-[0.75rem] font-bold text-gold-ink">
            일반 사용자용
          </span>
          <h3 className="mt-4 font-serif text-[1.5625rem] font-bold text-ink">계약자용 리포트</h3>
          <ul className="mt-5 flex flex-col gap-[0.8125rem]">
            {CONSUMER_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-[0.6875rem]">
                <CheckCircle className="size-[1.125rem] shrink-0 text-green" />
                <span className="text-[0.9375rem] text-ink-2">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.125rem] border border-navy bg-navy p-8">
          <span className="inline-flex h-6 items-center rounded-pill bg-gold px-2.5 text-[0.75rem] font-bold text-white">
            전문가용
          </span>
          <h3 className="mt-4 font-serif text-[1.5625rem] font-bold text-white">
            손해사정사용 심층 리포트
          </h3>
          <ul className="mt-5 flex flex-col gap-[0.8125rem]">
            {EXPERT_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-[0.6875rem]">
                <Check className="size-[1.125rem] shrink-0 text-white/85" />
                <span className="text-[0.9375rem] text-white/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
