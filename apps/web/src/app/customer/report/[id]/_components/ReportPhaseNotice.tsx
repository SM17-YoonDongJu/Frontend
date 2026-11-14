import Link from "next/link";
import { Clock } from "@/shared/ui/icons/Clock";
import { reportProposalsHref } from "@/app/customer/_shared/model/report-routes";
import {
  ANALYSIS_STOPPED_COPY,
  type AnalysisState
} from "@/app/customer/_shared/model/analysis-state";
import type { ReportPhase } from "../_model/report-phase";

type NoticePhase = Exclude<ReportPhase, "adopted">;

const NOTICE_COPY: Record<
  NoticePhase,
  { title: string; body: string; showProposalsLink: boolean }
> = {
  analyzing: {
    title: "분석 중이에요",
    body: "분석이 끝나면 이 화면에 결과가 바로 나타나요.",
    showProposalsLink: false
  },
  analysisStopped: {
    title: "분석 결과를 보여드릴 수 없어요",
    body: "리포트 분석이 끝나지 않았어요.",
    showProposalsLink: false
  },
  awaitingInspection: {
    title: "AI가 분석한 결과예요",
    body: "아래 내용은 참고용 AI 분석 결과예요. 손해사정사 검수가 끝나면 검수 의견과 상담 제안이 도착해요.",
    showProposalsLink: false
  },
  proposalsArrived: {
    title: "사정사 제안을 확인해보세요",
    body: "아래 내용은 AI 분석 결과예요. 사정사의 검수 의견과 상담은 받은 제안에서 이어져요.",
    showProposalsLink: true
  }
};

export function ReportPhaseNotice({
  phase,
  reportId,
  analysisState,
  failureMessage
}: {
  phase: NoticePhase;
  reportId: string;
  analysisState?: AnalysisState;
  /** 분석이 멈춘 이유를 설명하는 백엔드 문구. 없으면 기본 문구를 쓴다. */
  failureMessage?: string | null;
}) {
  const base = NOTICE_COPY[phase];
  const isStopped = phase === "analysisStopped";
  const copy = {
    ...base,
    title:
      (isStopped && analysisState && ANALYSIS_STOPPED_COPY[analysisState]?.title) || base.title,
    body: (isStopped && failureMessage?.trim()) || base.body
  };

  return (
    <section className="rounded-card border border-line bg-card px-[1.0625rem] py-4 lg:rounded-card-lg lg:p-6">
      <div className="flex gap-3 lg:gap-4">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-[1.25rem] bg-paper text-ink-3 lg:size-11 lg:rounded-full"
        >
          <Clock className="text-[1.125rem]" />
        </span>
        <div className="flex-1">
          <h2 className="text-[0.875rem] font-bold leading-[1.27rem] text-ink lg:text-[1rem] lg:font-semibold">
            {copy.title}
          </h2>
          <p className="mt-2 text-[0.75rem] leading-[1.21rem] text-ink-2 lg:text-[0.875rem] lg:leading-relaxed">
            {copy.body}
          </p>
          {copy.showProposalsLink && (
            <Link
              href={reportProposalsHref(reportId)}
              className="mt-3 inline-flex text-[0.75rem] font-semibold text-gold-ink underline underline-offset-2 lg:text-[0.8125rem]"
            >
              받은 제안 확인하기
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
