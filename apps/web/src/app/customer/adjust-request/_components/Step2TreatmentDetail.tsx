"use client";

import { Controller, useFormContext } from "react-hook-form";
import { blockNonNumericKeys, toNonNegativeInt } from "@/shared/lib/number-input";
import { FieldLabel } from "@/shared/ui/FieldLabel";
import { Input } from "@/shared/ui/Input";
import { MultiInputList } from "./MultiInputList";
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

export function Step2TreatmentDetail() {
  const { control, watch, setValue, formState } = useFormContext<AdjustRequestDraft>();
  const { errors } = formState;

  const treatmentTypes = watch("treatmentTypes") ?? [];
  const nonCoveredOption = watch("nonCoveredOption");
  const diagnosisRows = watch("diagnosis") ?? [""];

  const handleDiagnosisChange = (rows: string[]) => {
    setValue("diagnosis", rows, { shouldValidate: true });
  };

  const toggleTreatment = (t: TreatmentType) => {
    const next = treatmentTypes.includes(t)
      ? treatmentTypes.filter((x) => x !== t)
      : [...treatmentTypes, t];
    setValue("treatmentTypes", next, { shouldValidate: true });
  };

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.375rem]">
          어떤 진단을 받으셨나요?
        </h2>
        <p className="mt-1.5 text-[0.84375rem] text-ink-3">
          진단서에 기재된 진단명을 적어주세요. 여러 개면 모두 추가해 주세요.
        </p>
      </div>

      <div>
        <MultiInputList
          label="진단명"
          addLabel="진단명 추가"
          placeholder="예) 우측 슬관절 골절"
          values={diagnosisRows}
          onChange={handleDiagnosisChange}
        />
        {errors.diagnosis && (
          <span className="mt-2 block text-[0.75rem] font-medium text-terra">
            {errors.diagnosis.message}
          </span>
        )}
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
          <span className="mt-2 block text-[0.75rem] font-medium text-terra">
            {errors.treatmentTypes.message}
          </span>
        )}
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
          <span className="mt-2 block text-[0.75rem] font-medium text-terra">
            {errors.nonCoveredOption.message}
          </span>
        )}
      </div>
    </section>
  );
}
