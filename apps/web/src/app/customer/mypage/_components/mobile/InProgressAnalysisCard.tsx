"use client";

import Link from "next/link";
import { useInProgressAnalysis } from "../../_api/use-in-progress-analysis";
import {
  analysisStepIndex,
  toAnalysisStep,
} from "../../_model/analysis-step";
import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { FileText } from "@/shared/ui/icons/FileText";
import { MessageSquare } from "@/shared/ui/icons/MessageSquare";
import { AnalysisStepper } from "./AnalysisStepper";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}

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

function CaseRow({ report }: { report: ReportListItem }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10.5 shrink-0 items-center justify-center rounded-button bg-gold-soft text-gold-ink">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9375rem] font-bold text-ink">
          {report.accidentType ?? ""}
        </p>
        <p className="mt-0.5 truncate text-[0.75rem] text-ink-3">
          No.{report.reportNo} · {formatDate(report.createdAt)}
        </p>
      </div>
      {report.proposalCount > 0 && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-paper-2 px-2.5 py-1 text-[0.75rem] font-bold text-ink-2">
          <MessageSquare className="size-3" />
          제안 {report.proposalCount}건
        </span>
      )}
    </div>
  );
}

function AnalysisCta({ report }: { report: ReportListItem }) {
  const hasProposals = report.proposalCount > 0;
  const href = hasProposals
    ? `/customer/proposals/${report.reportId}`
    : `/customer/report/${report.reportId}`;
  const label = hasProposals
    ? `받은 제안 ${report.proposalCount}건 보기`
    : "분석 상세 보기";

  return (
    <Link
      href={href}
      className="mt-4 flex items-center justify-center gap-1.5 rounded-button bg-paper-2 py-3 text-[0.875rem] font-bold text-ink transition hover:brightness-[.96]"
    >
      {label}
      <ArrowRight className="size-[1.0625rem]" />
    </Link>
  );
}
