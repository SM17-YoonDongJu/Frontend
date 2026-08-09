"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { DatePicker } from "@/shared/ui/DatePicker";
import { FieldLabel } from "@/shared/ui/FieldLabel";
import { Input } from "@/shared/ui/Input";
import type { AdjustRequestDraft } from "../_model/types";

export function Step3AccidentDate() {
  const { control, formState } = useFormContext<AdjustRequestDraft>();
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({ control, name: "hospitalizations" });

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.375rem]">
          언제 있었던 일인가요?
        </h2>
        <p className="mt-1.5 text-[0.84375rem] text-ink-3">
          사고 발생일을 입력하고, 입원했다면 입원 기록을 추가해 주세요.
        </p>
      </div>

      <div>
        <FieldLabel>사고 발생일</FieldLabel>
        <Controller
          control={control}
          name="accidentDate"
          render={({ field }) => (
            <DatePicker
              className="max-w-[13.75rem]"
              value={field.value}
              onChange={field.onChange}
              placeholder="사고 발생일 선택"
              error={errors.accidentDate?.message}
            />
          )}
        />
      </div>

      <div>
        <FieldLabel>입원 기록</FieldLabel>

        {fields.length > 0 && (
          <div className="mb-3 flex flex-col gap-3">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-card border border-line p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[0.75rem] font-bold text-gold-ink">입원 {index + 1}차</span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-[0.78125rem] text-ink-3 transition hover:text-terra"
                  >
                    삭제
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>입원일</FieldLabel>
                    <Controller
                      control={control}
                      name={`hospitalizations.${index}.start`}
                      render={({ field: f }) => (
                        <DatePicker
                          value={f.value ?? undefined}
                          onChange={f.onChange}
                          placeholder="입원일 선택"
                          error={errors.hospitalizations?.[index]?.start?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <FieldLabel>퇴원일 (해당 시)</FieldLabel>
                    <Controller
                      control={control}
                      name={`hospitalizations.${index}.end`}
                      render={({ field: f }) => (
                        <DatePicker
                          value={f.value ?? undefined}
                          onChange={f.onChange}
                          placeholder="퇴원일 선택"
                          error={errors.hospitalizations?.[index]?.end?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <FieldLabel>입원 사유</FieldLabel>
                  <Controller
                    control={control}
                    name={`hospitalizations.${index}.reason`}
                    render={({ field: f }) => (
                      <Input
                        placeholder="예) 우측 슬관절 골절 수술 및 재활"
                        value={f.value ?? ""}
                        onChange={f.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => append({ start: "", end: null, reason: null })}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-input border border-line bg-paper-2 text-[0.875rem] font-bold text-ink-2 transition hover:border-ink/40"
        >
          <span className="text-[1.0625rem] leading-none">+</span>
          입원 기록 추가
        </button>

        <p className="mt-2 rounded-input border border-line-2 bg-paper-2 px-3.5 py-3 text-[0.8125rem] text-ink-3">
          입원하지 않았다면 비워두고 다음으로 넘어가세요.
        </p>
      </div>
    </section>
  );
}
