"use client";

import { useId } from "react";
import type { AnalysisMetricsRowView } from "../_model/analysis-metrics-format";

export interface AnalysisMetricsSectionProps {
  title: string;
  rows: AnalysisMetricsRowView[];
}

/** "AI 분석 근거" 패널 안의 한 묶음(라벨 · 값 목록). */
export function AnalysisMetricsSection({ title, rows }: AnalysisMetricsSectionProps) {
  const titleId = useId();

  return (
    <div>
      <h3 id={titleId} className="text-[0.8125rem] font-semibold text-ink-2">
        {title}
      </h3>
      <ul aria-labelledby={titleId} className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-start justify-between gap-4 text-[0.8125rem] leading-[1.25rem]"
          >
            <span className="shrink-0 text-ink-3">{row.label}</span>
            <span className="min-w-0 break-keep text-right font-medium text-ink">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
