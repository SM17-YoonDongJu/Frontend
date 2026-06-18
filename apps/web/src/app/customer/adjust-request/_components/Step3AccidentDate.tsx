"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import type { AdjustRequestDraft } from "../_model/types";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-[13px] font-semibold text-ink-2">{children}</span>;
}

export function Step3AccidentDate() {
  const { control, formState } = useFormContext<AdjustRequestDraft>();
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({ control, name: "hospitalizations" });

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-[22px] font-bold text-ink">언제 있었던 일인가요?</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-3">
          사고 발생일을 입력하고, 입원했다면 입원 기록을 추가해 주세요.
        </p>
      </div>

      <div>
        <FieldLabel>사고 발생일</FieldLabel>
        <Controller
          control={control}
          name="accidentDate"
          render={({ field }) => (
            <Input
              type="date"
              className="max-w-[200px]"
              value={field.value ?? ""}
              onChange={field.onChange}
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
          <p className="rounded-card border border-dashed border-line py-6 text-center text-[13px] text-ink-3">
            입원 기록이 없으면 건너뛰어도 됩니다.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-card border border-line p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-ink-2">입원 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-[12.5px] text-ink-3 hover:text-terra"
                  >
                    삭제
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel>입원일</FieldLabel>
                    <Controller
                      control={control}
                      name={`hospitalizations.${index}.start`}
                      render={({ field: f }) => (
                        <Input
                          type="date"
                          value={f.value ?? ""}
                          onChange={f.onChange}
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
                        <Input
                          type="date"
                          value={f.value ?? ""}
                          onChange={f.onChange}
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
