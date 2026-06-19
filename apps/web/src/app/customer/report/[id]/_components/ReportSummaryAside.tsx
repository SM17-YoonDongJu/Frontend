import { AmountRange } from "@/shared/ui/AmountRange";
import { REPORT_STATUS_META } from "../_model/report-status";
import type { ReportStatus } from "../_model/types";

export interface ReportSummaryAsideProps {
  status: ReportStatus;
  claimedMinAmount: number;
  claimedMaxAmount: number;
  offeredAmount?: number | null;
}

export function ReportSummaryAside({
  status,
  claimedMinAmount,
  claimedMaxAmount,
  offeredAmount,
}: ReportSummaryAsideProps) {
  const meta = REPORT_STATUS_META[status];

  return (
    <div className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="text-[15px] font-semibold text-ink">한눈에 보기</h2>

      <dl className="mt-2 divide-y divide-line-2">
        <div className="flex items-center justify-between gap-2 py-3">
          <dt className="text-[13px] text-ink-3">이 사정서의 검토 범위</dt>
          <dd>
            <AmountRange min={claimedMinAmount} max={claimedMaxAmount} />
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 py-3">
          <dt className="text-[13px] text-ink-3">제안받은 금액</dt>
          <dd className="text-[14px] font-semibold text-ink">
            {offeredAmount != null ? <AmountRange min={offeredAmount} /> : "제안 없음"}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2 py-3">
          <dt className="text-[13px] text-ink-3">권장 다음 단계</dt>
          <dd className="text-[14px] font-semibold text-gold-ink">{meta.nextStep}</dd>
        </div>
      </dl>
    </div>
  );
}
