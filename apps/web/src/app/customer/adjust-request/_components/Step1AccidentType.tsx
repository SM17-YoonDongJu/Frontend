"use client";

import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import {
  accidentTypeLabel,
  SUPPORTED_ACCIDENT_TYPE,
} from "@/shared/model/accident-type";
import { FileText } from "@/shared/ui/icons/FileText";
import { Pencil } from "@/shared/ui/icons/Pencil";
import { Scale } from "@/shared/ui/icons/Scale";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { TrendingUp } from "@/shared/ui/icons/TrendingUp";
import { AccidentTypeCard } from "./AccidentTypeCard";
import type { AdjustRequestDraft } from "../_model/types";

const ACCIDENT_TYPES: { value: string; description: string; icon: ReactNode }[] = [
  { value: "traffic", description: "자동차·이륜차 사고 보상", icon: <TrendingUp /> },
  { value: "disability", description: "장해등급·후유증 보상", icon: <Scale /> },
  { value: "medical_indemnity", description: "치료비·통원 보상", icon: <FileText /> },
  { value: "cancer_diagnosis", description: "진단·수술 보상", icon: <ShieldCheck /> },
  { value: "other", description: "직접 입력", icon: <Pencil /> },
];

export function Step1AccidentType() {
  const { watch, setValue } = useFormContext<AdjustRequestDraft>();
  const selected = watch("accidentType");

  return (
    <section>
      <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.375rem]">
        어떤 사고인가요?
      </h2>
      <p className="mt-1.5 text-[0.84375rem] text-ink-3">
        유형을 고르면 적용 가능한 약관·특약을 좁혀 분석합니다.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup">
        {ACCIDENT_TYPES.map((type) => (
          <AccidentTypeCard
            key={type.value}
            icon={type.icon}
            title={accidentTypeLabel(type.value)}
            description={type.description}
            selected={selected === type.value}
            disabled={type.value !== SUPPORTED_ACCIDENT_TYPE}
            onSelect={() =>
              setValue("accidentType", SUPPORTED_ACCIDENT_TYPE, { shouldValidate: true })
            }
          />
        ))}
      </div>

      <p className="mt-4 rounded-input bg-paper-2 px-4 py-3 text-[0.78125rem] leading-relaxed text-ink-3">
        현재는 <span className="font-semibold text-ink-2">{accidentTypeLabel(SUPPORTED_ACCIDENT_TYPE)}</span> 유형만
        분석할 수 있어요. 다른 유형은 순차적으로 지원할 예정입니다.
      </p>
    </section>
  );
}
