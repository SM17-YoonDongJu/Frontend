"use client";

import { Controller, useFormContext } from "react-hook-form";
import { blockNonNumericKeys, toNonNegativeInt } from "@/shared/lib/number-input";
import { Input } from "@/shared/ui/Input";
import { ToggleChip } from "./ToggleChip";
import type { AdjustRequestDraft, NonCoveredOption, TreatmentType } from "../_model/types";

const TREATMENTS: { value: TreatmentType; label: string }[] = [
  { value: "ADMISSION", label: "입원" },
  { value: "OUTPATIENT", label: "통원" },
  { value: "MEDICATION", label: "약제" },
  { value: "SURGERY", label: "수술" },
];

const NON_COVERED: { value: NonCoveredOption; label: string }[] = [
  { value: "INCLUDED", label: "포함" },
  { value: "EXCLUDED", label: "미포함" },
  { value: "UNKNOWN", label: "모름" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-[13px] font-semibold text-ink-2">{children}</span>;
}

export function Step2TreatmentDetail() {
  const { control, watch, setValue, formState } = useFormContext<AdjustRequestDraft>();
  const { errors } = formState;

  const treatmentTypes = watch("treatmentTypes") ?? [];
  const nonCoveredOption = watch("nonCoveredOption");

  const toggleTreatment = (t: TreatmentType) => {
    const next = treatmentTypes.includes(t)
      ? treatmentTypes.filter((x) => x !== t)
      : [...treatmentTypes, t];
    setValue("treatmentTypes", next, { shouldValidate: true });
  };

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-[22px] font-bold text-ink">어떤 치료를 받으셨나요?</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-3">
          치료 형태와 내용을 입력하면 통원·입원 비급여 보장을 분석합니다.
        </p>
      </div>

      <div>
        <FieldLabel>치료 형태 (복수 선택)</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {TREATMENTS.map((t) => (
            <ToggleChip
              key={t.value}
              label={t.label}
              selected={treatmentTypes.includes(t.value)}
              onClick={() => toggleTreatment(t.value)}
            />
          ))}
        </div>
        {errors.treatmentTypes && (
          <span className="mt-2 block text-[12px] font-medium text-terra">
            {errors.treatmentTypes.message}
          </span>
        )}
      </div>

      <div>
        <FieldLabel>진단명·치료 내용</FieldLabel>
        <Controller
          control={control}
          name="diagnosis"
          render={({ field }) => (
            <Input
              placeholder="예) 우측 슬관절 골절"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.diagnosis?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>입원·통원 횟수</FieldLabel>
          <Controller
            control={control}
            name="treatmentCount"
            render={({ field }) => (
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="예) 12"
                suffix="회"
                value={field.value ?? ""}
                onKeyDown={blockNonNumericKeys}
                onChange={(e) => field.onChange(toNonNegativeInt(e.target.value))}
              />
            )}
          />
        </div>
        <div>
          <FieldLabel>총 치료비 (본인 부담)</FieldLabel>
          <Controller
            control={control}
            name="totalTreatmentCost"
            render={({ field }) => (
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="예) 3200000"
                suffix="원"
                value={field.value ?? ""}
                onKeyDown={blockNonNumericKeys}
                onChange={(e) => field.onChange(toNonNegativeInt(e.target.value))}
              />
            )}
          />
        </div>
      </div>

      <div>
        <FieldLabel>비급여 항목 포함</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {NON_COVERED.map((o) => (
            <ToggleChip
              key={o.value}
              label={o.label}
              selected={nonCoveredOption === o.value}
              onClick={() => setValue("nonCoveredOption", o.value, { shouldValidate: true })}
            />
          ))}
        </div>
        {errors.nonCoveredOption && (
          <span className="mt-2 block text-[12px] font-medium text-terra">
            비급여 포함 여부를 선택하세요.
          </span>
        )}
      </div>

      <div>
        <FieldLabel>가입 보험·특약</FieldLabel>
        <Controller
          control={control}
          name="enrolledInsurance"
          render={({ field }) => (
            <Input
              placeholder="예) OO손해보험·무배당 행복드림 종합보험"
              value={field.value ?? ""}
              onChange={field.onChange}
              hint="정확한 특약은 다음 단계에서 보험증권을 올리면 자동 인식됩니다."
            />
          )}
        />
      </div>
    </section>
  );
}
