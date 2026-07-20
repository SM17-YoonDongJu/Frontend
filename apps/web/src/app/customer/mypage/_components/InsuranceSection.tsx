"use client";

import { useRef } from "react";
import { useAddInsurance } from "../_api/use-add-insurance";
import { useInsuranceList } from "../_api/use-insurance-list";
import { Plus } from "@/shared/ui/icons/Plus";
import { toast } from "@/shared/ui/toast";
import { InsuranceCard } from "./InsuranceCard";
import { InsuranceDirectInput } from "./InsuranceDirectInput";
import { InsuranceEmpty } from "./InsuranceEmpty";

/** PC 내 보험 정보 섹션 — 헤더(건수·추가) + 안내 + 2열 그리드 + 직접 입력. */
export function InsuranceSection() {
  const { data } = useInsuranceList();
  const { mutate: addInsurance, isPending } = useAddInsurance();
  const inputRef = useRef<HTMLInputElement>(null);

  const insurances = data.list;
  const isEmpty = insurances.length === 0;

  // TODO(#105): 단일 필드 직접 입력 → 보험사·상품 분리 매핑 백엔드 확정 전 잠정(동일 값 전달).
  const handleAdd = (value: string) =>
    addInsurance(
      { insurerName: value, productName: value },
      {
        onError: () =>
          toast.error("보험 추가에 실패했어요. 잠시 후 다시 시도해 주세요."),
      },
    );

  return (
    <section className="rounded-card border border-line bg-card p-6 shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-baseline gap-2 text-[1.0625rem] font-bold text-ink">
          내 보험 정보
          <span className="text-[0.8125rem] font-bold text-ink-3">
            {insurances.length}건
          </span>
        </h2>
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="inline-flex items-center gap-1.5 rounded-button border border-line px-3.5 py-2 text-[0.8125rem] font-bold text-ink transition hover:bg-paper"
        >
          보험 추가
          <Plus className="size-[0.9375rem]" />
        </button>
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

      <InsuranceDirectInput
        ref={inputRef}
        className="mt-4"
        disabled={isPending}
        onSubmit={handleAdd}
      />
    </section>
  );
}
