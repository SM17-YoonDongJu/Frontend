"use client";

import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import {
  accidentTypeLabel,
  SUPPORTED_ACCIDENT_TYPE,
  type AccidentType,
} from "@/shared/model/accident-type";
import { FileText } from "@/shared/ui/icons/FileText";
import { Pencil } from "@/shared/ui/icons/Pencil";
import { Scale } from "@/shared/ui/icons/Scale";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { TrendingUp } from "@/shared/ui/icons/TrendingUp";
import { Tooltip } from "@/shared/ui/Tooltip";
import { AccidentTypeCard } from "./AccidentTypeCard";
import type { AdjustRequestDraft } from "../_model/types";

// 지원 유형(실손 의료비)이 첫 번째로 오도록 배치.
const ACCIDENT_TYPES: { value: AccidentType; description: string; icon: ReactNode }[] = [
  { value: "medical_indemnity", description: "치료비·통원 보상", icon: <FileText /> },
  { value: "traffic", description: "자동차·이륜차 사고 보상", icon: <TrendingUp /> },
  { value: "disability", description: "장해등급·후유증 보상", icon: <Scale /> },
  { value: "cancer_diagnosis", description: "진단·수술 보상", icon: <ShieldCheck /> },
  { value: "other", description: "직접 입력", icon: <Pencil /> },
];

const LOCKED_TOOLTIP = "추후에 지원 예정입니다.";

export function Step1AccidentType() {
  const { watch, setValue, formState } = useFormContext<AdjustRequestDraft>();
  const { errors } = formState;
  const selected = watch("accidentType");

  return (
    <section>
      <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.375rem]">
        어떤 사고인가요?
      </h2>
      <p className="mt-1.5 text-[0.84375rem] text-ink-3">
        유형에 맞춰 약관·특약을 분석해드려요.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup">
        {ACCIDENT_TYPES.map((type) => {
          const locked = type.value !== SUPPORTED_ACCIDENT_TYPE;
          const card = (
            <AccidentTypeCard
              key={type.value}
              icon={type.icon}
              title={accidentTypeLabel(type.value)}
              description={type.description}
              selected={selected === type.value}
              disabled={locked}
              onSelect={() =>
                setValue("accidentType", SUPPORTED_ACCIDENT_TYPE, { shouldValidate: true })
              }
            />
          );
          if (!locked) return card;
          return (
            <Tooltip key={type.value} label={LOCKED_TOOLTIP} className="w-full cursor-not-allowed">
              {card}
            </Tooltip>
          );
        })}
      </div>

      {errors.accidentType && (
        <p className="mt-3 text-[0.75rem] font-medium text-terra">{errors.accidentType.message}</p>
      )}

      <p className="mt-4 rounded-input bg-paper-2 px-4 py-3 text-[0.78125rem] leading-relaxed text-ink-3">
        현재는 <span className="font-semibold text-ink-2">{accidentTypeLabel(SUPPORTED_ACCIDENT_TYPE)}</span> 유형만
        분석할 수 있어요. 다른 유형은 순차적으로 지원할 예정입니다.
      </p>
    </section>
  );
}
