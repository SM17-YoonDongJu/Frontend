"use client";

import { useInProgressAnalysis } from "../../_api/use-in-progress-analysis";
import {
  analysisStepIndex,
  toAnalysisStep,
} from "../../_model/analysis-step";
import { AnalysisCta } from "./AnalysisCta";
import { AnalysisStepper } from "./AnalysisStepper";
import { CaseRow } from "./CaseRow";

/** 진행 중 분석 카드 — 케이스 행 + 스테퍼 + CTA. 0건 시 빈 상태. */
export function InProgressAnalysisCard() {
  const { data } = useInProgressAnalysis();
  const report = data.list[0];

  if (!report) {
    return (
      <p className="rounded-card border border-dashed border-line bg-paper-2 px-5 py-8 text-center text-[0.8125rem] text-ink-3">
        진행 중인 분석이 없어요.
      </p>
    );
  }

  return (
    <div className="rounded-card border border-line bg-card p-5">
      <CaseRow report={report} />

      <div className="mt-4">
        <AnalysisStepper
          currentStep={analysisStepIndex(toAnalysisStep(report.status))}
        />
      </div>

      <AnalysisCta report={report} />
    </div>
  );
}
