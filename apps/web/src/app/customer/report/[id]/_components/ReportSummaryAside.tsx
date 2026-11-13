import { AmountRange } from "@/shared/ui/AmountRange";
import { REPORT_STATUS_META } from "../_model/report-status";
import type { ReportPhase } from "../_model/report-phase";
import type { ReportStatus } from "../_model/types";

export interface ReportSummaryAsideProps {
  phase: ReportPhase;
  status: ReportStatus;
  claimedMinAmount: number | null;
  claimedMaxAmount: number | null;
  offeredAmount?: number | null;
}

export function ReportSummaryAside({
  phase,
  status,
  claimedMinAmount,
  claimedMaxAmount,
  offeredAmount
}: ReportSummaryAsideProps) {
  const meta = REPORT_STATUS_META[status];
  // 사정사 검수가 반영되기 전에는 AI 분석 기준의 추정 범위다.
  const rangeLabel = phase === "adopted" ? "이 사정서의 검토 범위" : "예상 보상 범위";
  const nextStep = phase === "awaitingInspection" ? "검수 후 제안 도착" : meta.nextStep;

  return (
    <div className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="text-[0.9375rem] font-semibold text-ink">한눈에 보기</h2>

      <dl className="mt-2 divide-y divide-line-2">
        <div className="flex items-center justify-between gap-2 py-3">
          <dt className="text-[0.8125rem] text-ink-3">{rangeLabel}</dt>
          <dd className="text-[0.875rem] font-semibold text-ink">
            {claimedMinAmount != null && claimedMaxAmount != null ? (
              <AmountRange min={claimedMinAmount} max={claimedMaxAmount} />
            ) : (
              "미산정"
            )}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 py-3">
          <dt className="text-[0.8125rem] text-ink-3">제안받은 금액</dt>
          <dd className="text-[0.875rem] font-semibold text-ink">
            {offeredAmount != null ? <AmountRange min={offeredAmount} /> : "제안 없음"}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 py-3">
          <dt className="text-[0.8125rem] text-ink-3">권장 다음 단계</dt>
          <dd className="text-[0.875rem] font-semibold text-gold-ink">{nextStep}</dd>
        </div>
      </dl>
    </div>
  );
}
