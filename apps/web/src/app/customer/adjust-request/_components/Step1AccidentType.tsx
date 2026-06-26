"use client";

import { useFormContext } from "react-hook-form";
import {
  ACCIDENT_TYPE_LABELS,
  SUPPORTED_ACCIDENT_TYPE,
} from "@/shared/model/accident-type";
import { AccidentTypeCard } from "./AccidentTypeCard";
import type { AdjustRequestDraft } from "../_model/types";

const ACCIDENT_TYPES = [
  { value: "traffic", description: "자동차·이륜차 사고 보상" },
  { value: "disability", description: "장해등급·후유증 보상" },
  { value: "medical_indemnity", description: "치료비·통원 보상" },
  { value: "cancer_diagnosis", description: "진단·수술 보상" },
  { value: "other", description: "직접 입력" },
] as const;

export function Step1AccidentType() {
  const { watch, setValue } = useFormContext<AdjustRequestDraft>();
  const selected = watch("accidentType");

  return (
    <section>
      <h2 className="font-serif text-[22px] font-bold text-ink">어떤 사고인가요?</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-3">
        유형을 고르면 적용 가능한 약관·특약을 좁혀 분석합니다.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup">
        {ACCIDENT_TYPES.map((type) => (
          <AccidentTypeCard
            key={type.value}
            title={ACCIDENT_TYPE_LABELS[type.value]}
            description={type.description}
            selected={selected === type.value}
            disabled={type.value !== SUPPORTED_ACCIDENT_TYPE}
            onSelect={() =>
              setValue("accidentType", SUPPORTED_ACCIDENT_TYPE, { shouldValidate: true })
            }
          />
        ))}
      </div>
    </section>
  );
}
