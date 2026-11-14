"use client";

import { useId, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { buildAnalysisMetricsSections } from "../_model/analysis-metrics-format";
import type { AnalysisMetricsState } from "../_model/analysis-metrics-state";
import { AnalysisMetricsNotice } from "./AnalysisMetricsNotice";
import { AnalysisMetricsPanelSkeleton } from "./AnalysisMetricsPanelSkeleton";
import { AnalysisMetricsSection } from "./AnalysisMetricsSection";

export interface AnalysisMetricsPanelProps {
  state: AnalysisMetricsState;
}

/**
 * "AI 분석 근거" 접이식 패널. 기술 수치라 데스크톱에서도 기본 접힘(#324 D1).
 * 수치 조회가 늦거나 실패해도 이 자리 안에서만 처리한다 — 상세 본문은 그대로.
 */
export function AnalysisMetricsPanel({ state }: AnalysisMetricsPanelProps) {
  // 상태 분기(조기 반환)보다 먼저 호출 — 훅 호출 순서 고정.
  const [open, setOpen] = useState(false);
  const headingId = useId();
  const bodyId = useId();

  if (state.status === "hidden") return null;
  if (state.status === "loading") return <AnalysisMetricsPanelSkeleton />;
  if (state.status === "legacy") return <AnalysisMetricsNotice variant="legacy" />;
  if (state.status === "unavailable") return <AnalysisMetricsNotice variant="unavailable" />;

  const sections = buildAnalysisMetricsSections(state.metrics);
  // 응답은 왔지만 보여줄 줄이 하나도 없으면 빈 패널 대신 "수치 없음" 안내.
  if (sections.length === 0) return <AnalysisMetricsNotice variant="legacy" />;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-card border border-line bg-card lg:rounded-card-lg lg:bg-paper-2"
    >
      <h2 id={headingId}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="flex w-full items-center justify-between px-[1.125rem] py-[0.9375rem] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:px-6 lg:py-5"
        >
          <span className="text-[0.9rem] font-bold text-ink lg:text-[0.9375rem] lg:font-semibold lg:text-ink-2">
            AI 분석 근거
          </span>
          <ChevronDown
            className={cn("text-[1.125rem] text-ink-3 transition-transform", open && "rotate-180")}
          />
        </button>
      </h2>

      <div
        id={bodyId}
        className={cn(
          open ? "block" : "hidden",
          "border-t border-line-2 px-[1.125rem] pb-4 pt-3 lg:px-6 lg:pb-6",
        )}
      >
        <p className="text-[0.75rem] leading-[1.2rem] text-ink-3">
          AI가 이 리포트를 만들며 참고한 자료와 자체 점검 결과예요.
        </p>
        <div className="mt-3 space-y-4">
          {sections.map((section) => (
            <AnalysisMetricsSection key={section.title} title={section.title} rows={section.rows} />
          ))}
        </div>
      </div>
    </section>
  );
}
