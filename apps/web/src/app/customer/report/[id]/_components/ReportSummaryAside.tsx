import { AmountRange } from "@/shared/ui/AmountRange";
import { StatusBadge } from "@/shared/ui/StatusBadge";
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

      <dl className="mt-4 space-y-4">
        <div>
          <dt className="text-[12.5px] text-ink-3">예상 보상 범위</dt>
          <dd className="mt-1">
            <AmountRange min={claimedMinAmount} max={claimedMaxAmount} size="lg" />
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2">
          <dt className="text-[13px] text-ink-3">제안받은 금액</dt>
          <dd className="text-[14px] font-semibold text-ink">
            {offeredAmount != null ? <AmountRange min={offeredAmount} /> : "제안 없음"}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2">
          <dt className="text-[13px] text-ink-3">진행 단계</dt>
          <dd>
            <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          </dd>
        </div>
      </dl>
    </div>
  );
}
