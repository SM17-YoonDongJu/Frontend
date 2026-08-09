"use client";

import { useInsuranceList } from "../_api/use-insurance-list";
import { InsuranceCard } from "./InsuranceCard";
import { InsuranceEmpty } from "./InsuranceEmpty";
import { ComingSoonButton } from "./ComingSoonButton";

/** PC 내 보험 정보 섹션 — 헤더(건수·추가) + 안내 + 2열 그리드. 직접 추가는 백엔드 미구현으로 준비 중 안내. */
export function InsuranceSection() {
  const { data } = useInsuranceList();

  const insurances = data.list;
  const isEmpty = insurances.length === 0;

  return (
    <section className="rounded-card border border-line bg-card p-6 shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-baseline gap-2 text-[1.0625rem] font-bold text-ink">
          내 보험 정보
          <span className="text-[0.8125rem] font-bold text-ink-3">
            {insurances.length}건
          </span>
        </h2>
        <ComingSoonButton className="rounded-button border border-line px-3.5 py-2 text-[0.8125rem] font-bold text-ink hover:bg-paper">
          보험 추가
        </ComingSoonButton>
      </div>

      <p className="mt-3 text-[0.8125rem] text-ink-3">
        등록해두면 분석 입력 시 자동으로 불러와요. 증권을 올리면 특약까지 자동 인식됩니다.
      </p>

      {isEmpty ? (
        <InsuranceEmpty className="mt-4" />
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {insurances.map((item) => (
            <InsuranceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
