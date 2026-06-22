"use client";

import { Input } from "@/shared/ui/Input";
import { Scale } from "@/shared/ui/icons/Scale";

export interface OverallOpinionSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const OPINION_PLACEHOLDER =
  "검토 결과와 근거(약관·사례)를 정리해 주세요. 확정 금액 보장이나 법률 자문이 아닌 검토 의견으로 작성합니다.";

export function OverallOpinionSection({ value, onChange }: OverallOpinionSectionProps) {
  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="flex items-center gap-2 font-serif text-[17px] font-bold text-ink">
        <Scale className="text-gold" />
        손해사정사 종합 의견
      </h2>
      <p className="mt-1.5 text-[13px] text-ink-3">고객 리포트 상단에 함께 전달됩니다.</p>

      <Input
        aria-label="손해사정사 종합 의견"
        multiline
        rows={5}
        className="mt-4"
        placeholder={OPINION_PLACEHOLDER}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </section>
  );
}
