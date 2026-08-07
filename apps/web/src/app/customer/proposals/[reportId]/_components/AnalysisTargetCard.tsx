import Link from "next/link";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { FileText } from "@/shared/ui/icons/FileText";

interface AnalysisTargetCardProps {
  reportId: string;
  /** 분석 대상 요약은 명세 미확정 확장 필드 — 없으면 기본 문구로 리포트 진입점만 유지한다. */
  accidentType?: string;
  reportNo?: string;
  proposalCount: number;
}

export function AnalysisTargetCard({
  reportId,
  accidentType,
  reportNo,
  proposalCount,
}: AnalysisTargetCardProps) {
  return (
    <Link
      href={`/customer/report/${reportId}`}
      className="flex items-center gap-4 rounded-input border border-line bg-paper-2 px-5 py-4 transition hover:brightness-[.96]"
    >
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-gold-soft text-gold-ink"
      >
        <FileText className="text-[1.25rem]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[1rem] font-semibold text-ink">
          {accidentType ? `${accidentType} 리포트` : "분석 리포트"}
        </p>
        <p className="mt-1 text-[0.8125rem] text-ink-3">
          {reportNo ? `No.${reportNo} · ` : ""}제안 {proposalCount}건
        </p>
      </div>
      <ChevronRight className="shrink-0 text-[1rem] text-ink-3" />
    </Link>
  );
}
