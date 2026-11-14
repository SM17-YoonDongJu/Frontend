"use client";

import { useId } from "react";

export interface AnalysisMetricsNoticeProps {
  /** legacy = 수치가 없는 리포트(또는 보여줄 줄이 없음), unavailable = 지금 불러올 수 없음. */
  variant: "legacy" | "unavailable";
}

const NOTICE_MESSAGE: Record<AnalysisMetricsNoticeProps["variant"], string> = {
  legacy: "이 리포트에는 분석 근거 수치가 없어요",
  unavailable: "지금은 분석 근거를 불러올 수 없어요",
};

/** 수치를 보여줄 수 없을 때 패널 자리에 남기는 중립 안내(토글 없음). 상세 본문에는 영향이 없다. */
export function AnalysisMetricsNotice({ variant }: AnalysisMetricsNoticeProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-card border border-line bg-card px-[1.125rem] py-[0.9375rem] lg:rounded-card-lg lg:bg-paper-2 lg:px-6 lg:py-5"
    >
      <h2
        id={titleId}
        className="text-[0.9rem] font-bold text-ink lg:text-[0.9375rem] lg:font-semibold lg:text-ink-2"
      >
        AI 분석 근거
      </h2>
      <p className="mt-1 text-[0.8125rem] leading-[1.25rem] text-ink-3">{NOTICE_MESSAGE[variant]}</p>
    </section>
  );
}
