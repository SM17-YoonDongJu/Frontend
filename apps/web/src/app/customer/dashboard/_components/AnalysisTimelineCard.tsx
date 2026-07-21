"use client";

import Link from "next/link";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { Check } from "@/shared/ui/icons/Check";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { useDashboard } from "../_api/use-dashboard";
import type { DashboardActiveReport } from "../_model/dashboard.schema";
import type { ReportStatus } from "@/app/customer/_shared/model/report-list.schema";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";

type StepState = "completed" | "current" | "future";

const STATUS_PILL_LABEL: Record<ReportStatus, string> = {
  AWAITING_INSPECTION: "검수 중",
  AWAITING_ADOPTION: "제안 도착",
  COUNSELING: "매칭 완료",
  CLOSED: "매칭 완료",
  NOT_SELECTED: "제안 도착",
};

// 매칭(4단계)은 항상 미래 단계 — status가 아니라 고정. 현재 단계는 검수 대기(2)까지는
// AWAITING_INSPECTION, 그 외에는 제안 도착(3)으로 본다(MATCHED enum 미확정).
function currentStepIndex(status: ReportStatus): number {
  return status === "AWAITING_INSPECTION" ? 2 : 3;
}

function formatMonthDay(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}. ${date.getDate()}`;
}

interface Step {
  index: number;
  label: string;
  mobileLabel: string;
  subtext: string;
  state: StepState;
}

function buildSteps(report: DashboardActiveReport): Step[] {
  const current = currentStepIndex(report.status);
  const reviewDone = report.firstReviewedAt !== null;

  const reviewState: StepState = reviewDone ? "completed" : current === 2 ? "current" : "future";
  const proposalSubtext =
    report.proposalCount > 0 ? `${report.proposalCount}건 · 진행 중` : "제안 대기";

  return [
    {
      index: 1,
      label: "신청 완료",
      mobileLabel: "신청",
      subtext: formatMonthDay(report.createdAt),
      state: "completed",
    },
    {
      index: 2,
      label: "검수 대기중",
      mobileLabel: "검수",
      subtext: report.firstReviewedAt ? formatMonthDay(report.firstReviewedAt) : "진행 중",
      state: reviewState,
    },
    {
      index: 3,
      label: "제안 도착",
      mobileLabel: "제안 도착",
      subtext: proposalSubtext,
      state: current >= 3 ? "current" : "future",
    },
    {
      index: 4,
      label: "사정사 매칭",
      mobileLabel: "매칭",
      subtext: "제안 선택 후",
      state: "future",
    },
  ];
}

const CIRCLE_STATE_CLASS: Record<StepState, string> = {
  completed: "bg-green-soft text-green",
  current: "bg-gold text-white",
  future: "border border-line bg-paper text-ink-3",
};

export function AnalysisTimelineCard() {
  const { data } = useDashboard();
  const report = data.activeReport;

  if (!report) return null;

  const steps = buildSteps(report);

  return (
    <section className="rounded-card border border-line bg-card p-[1.5625rem]">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">진행 중인 분석</h2>
        <Link
          href={DASHBOARD_LINKS.report(report.reportId)}
          className="text-[0.8125rem] font-medium text-ink-3 transition hover:text-ink-2"
        >
          <span className="md:hidden">상세</span>
          <span className="hidden md:inline">리포트 상세</span> ›
        </Link>
      </header>

      <div className="mt-4 flex items-center gap-2.5">
        <span className="text-[0.9375rem] font-semibold text-ink">
          {report.title}
          <span className="hidden md:inline"> · {accidentTypeLabel(report.accidentType)}</span>
        </span>
        <span className="shrink-0 rounded-pill bg-gold-soft px-2.5 py-1 text-[0.75rem] font-semibold text-gold-ink">
          {STATUS_PILL_LABEL[report.status]}
        </span>
      </div>

      <ol className="mt-5 flex items-start">
        {steps.map((step) => (
          <li key={step.index} className="relative flex flex-1 flex-col items-center">
            {step.index > 1 && <StepConnector reached={step.state !== "future"} />}
            <span
              className={`relative z-10 flex size-6 items-center justify-center rounded-full text-[0.8125rem] font-bold md:size-[1.875rem] ${CIRCLE_STATE_CLASS[step.state]}`}
            >
              {step.state === "completed" ? (
                <Check className="text-[0.875rem]" />
              ) : (
                step.index
              )}
            </span>
            <span
              className={`mt-2.5 text-center text-[0.8125rem] ${step.state === "future" ? "font-medium text-ink-3" : "font-semibold text-ink"}`}
            >
              <span className="md:hidden">{step.mobileLabel}</span>
              <span className="hidden md:inline">{step.label}</span>
            </span>
            <span className="mt-1 hidden text-center text-[0.75rem] text-ink-3 md:block">
              {step.subtext}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-5 hidden items-center gap-2 rounded-input border border-line-2 bg-paper-2 px-[1.0625rem] py-3.5 md:flex">
        <ShieldCheck className="shrink-0 text-[0.9375rem] text-gold" />
        <p className="text-[0.8125rem] text-ink-2">
          제안을 선택하면 해당 사정사와 상담 채팅이 열려요. 선택 전까지 비용은 발생하지 않아요.
        </p>
      </div>
    </section>
  );
}

function StepConnector({ reached }: { reached: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute right-1/2 top-3 z-0 h-px w-full md:top-[0.9375rem] ${reached ? "bg-gold-2" : "bg-line"}`}
    />
  );
}
