"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/shared/ui/Button";
import { DatePicker } from "@/shared/ui/DatePicker";
import { Input } from "@/shared/ui/Input";
import type { AdjustRequestDraft } from "../_model/types";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-[0.8125rem] font-semibold text-ink-2">{children}</span>;
}

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
        <div className="mb-3 flex items-center justify-between">
          <FieldLabel>입원 기록</FieldLabel>
          <Button
            variant="outline"
            size="sm"
            onClick={() => append({ start: "", end: null, reason: null })}
          >
            + 입원 추가하기
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="rounded-card border border-dashed border-line py-6 text-center text-[0.8125rem] text-ink-3">
            입원 기록이 없으면 건너뛰어도 됩니다.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
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
      </div>
    </section>
  );
}
