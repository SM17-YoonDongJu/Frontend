import { Fragment } from "react";
import { cn } from "@/shared/lib/utils";
import { Check } from "@/shared/ui/icons/Check";
import { ANALYSIS_STEPS, type AnalysisStep } from "../../_model/analysis-step";

const STEP_LABEL: Record<AnalysisStep, string> = {
  INFO_INPUT: "정보 입력",
  AI_ANALYSIS: "AI 분석",
  EXPERT_REVIEW: "전문가 검수",
  PROPOSAL_ARRIVED: "제안 도착",
};

interface AnalysisStepperProps {
  /** 현재 단계 인덱스(0~3) */
  currentStep: number;
}

/** 진행 중 분석 4단계 스테퍼. 완료=초록 체크 / 현재=navy 강조 / 예정=흐림. */
export function AnalysisStepper({ currentStep }: AnalysisStepperProps) {
  return (
    <ol className="flex items-start">
      {ANALYSIS_STEPS.map((step, index) => {
        const done = index < currentStep;
        const active = index === currentStep;

        return (
          <Fragment key={step}>
            {index > 0 && (
              <li
                aria-hidden
                className={cn(
                  "mt-4 h-0.5 flex-1 rounded-full",
                  index <= currentStep ? "bg-green" : "bg-line-2",
                )}
              />
            )}
            <li className="flex shrink-0 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-8.5 items-center justify-center rounded-full",
                  done && "bg-green text-white",
                  active && "bg-navy text-white",
                  !done && !active && "bg-paper-2 text-ink-3",
                )}
              >
                {done ? (
                  <Check className="size-4" />
                ) : (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      active ? "bg-white" : "bg-ink-3/50",
                    )}
                  />
                )}
              </span>
              <span
                className={cn(
                  "text-[0.75rem]",
                  index <= currentStep ? "font-semibold text-ink-2" : "text-ink-3",
                )}
              >
                {STEP_LABEL[step]}
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
