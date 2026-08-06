"use client";

import { Controller, useFormContext } from "react-hook-form";
import { MessageSquare } from "@/shared/ui/icons/MessageSquare";
import { Plus } from "@/shared/ui/icons/Plus";
import { Textarea } from "@/shared/ui/Textarea";
import { QUESTION_MAX_LENGTH } from "../_model/report-request.schema";
import type { AdjustRequestDraft } from "../_model/types";

/** 눌러서 넣는 칩이 아니라 무엇을 적으면 되는지 보여주는 예시다. */
const QUESTION_EXAMPLES = [
  "제안받은 보험금이 적정한지 궁금해요",
  "과실 비율에 이의가 있어요",
  "이미 합의했는데 추가 청구가 가능할까요?",
  "어떤 서류가 더 필요한가요?",
];

export function Step5Question() {
  const { control, formState } = useFormContext<AdjustRequestDraft>();
  const { errors } = formState;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.375rem]">
          손해사정사에게 전할 말이 있나요?
        </h2>
        <p className="mt-1.5 text-[0.84375rem] text-ink-3">
          <span className="sm:hidden">
            궁금한 점이나 특이사항을 자유롭게 적어주세요. 검수하는 손해사정사가 함께 확인해요.
          </span>
          <span className="hidden sm:inline">
            궁금한 점이나 특이사항을 자유롭게 적어주세요. 검수하는 손해사정사가 함께 확인합니다.
            (선택)
          </span>
        </p>
      </div>

      <div>
        <span className="mb-2 block text-[0.8125rem] font-semibold text-ink-2 sm:hidden">
          궁금한 점 · 특이사항 <span className="font-medium text-ink-3">(선택)</span>
        </span>
        <Controller
          control={control}
          name="question"
          render={({ field }) => (
            <Textarea
              value={field.value ?? ""}
              onChange={field.onChange}
              maxLength={QUESTION_MAX_LENGTH}
              counterPlacement="inside"
              resizable={false}
              aria-label="궁금한 점 · 특이사항"
            />
          )}
        />
        {errors.question?.message && (
          <p className="mt-1.5 text-[0.8125rem] font-medium text-terra">{errors.question.message}</p>
        )}
      </div>

      <div>
        <span className="mb-3 block text-[0.8125rem] font-bold text-ink-3">이런 걸 많이 물어봐요</span>
        <ul className="flex flex-wrap gap-2">
          {QUESTION_EXAMPLES.map((example) => (
            <li
              key={example}
              className="flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3.5 py-2 text-[0.8125rem] font-bold text-ink-2"
            >
              <Plus className="shrink-0 text-[0.8125rem] text-ink-3" />
              {example}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2.5 rounded-input border border-line-2 bg-paper-2 px-4 py-3.5">
        <MessageSquare className="shrink-0 text-[1.0625rem] text-ink-3" />
        <p className="text-[0.8125rem] leading-relaxed text-ink-3">
          지금 적지 않아도 분석 요청 후 채팅으로 언제든 전할 수 있어요.
        </p>
      </div>
    </section>
  );
}
