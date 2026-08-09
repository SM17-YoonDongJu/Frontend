import Link from "next/link";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { REPORT_STATUS_META } from "../_model/report-status";
import type { ReportStatus } from "../_model/types";

export interface ReportSummaryProps {
  status: ReportStatus;
  reviewComment?: string | null;
  reviewedAt?: string | null;
  adjusterName?: string | null;
  adjusterCareer?: string | null;
  adjusterId?: string | null;
}

function formatReviewedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

export function ReportSummary({
  status,
  reviewComment,
  reviewedAt,
  adjusterName,
  adjusterCareer,
  adjusterId,
}: ReportSummaryProps) {
  const meta = REPORT_STATUS_META[status];
  const subtitle = [adjusterCareer, reviewedAt && `${formatReviewedDate(reviewedAt)} 검수`]
    .filter(Boolean)
    .join(" · ");
  const avatarChar = adjusterName?.slice(0, 1);

  const adjusterNameNode =
    adjusterName && adjusterId ? (
      <Link href={`/customer/adjusters/${adjusterId}`} className="underline underline-offset-2">
        {adjusterName}
      </Link>
    ) : (
      adjusterName
    );

  return (
    <section className="rounded-card border border-green bg-card px-[1.0625rem] py-4 lg:rounded-card-lg lg:border-line lg:p-6">
      <div className="flex gap-3 lg:gap-4">
        {avatarChar && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[1.25rem] bg-navy font-serif text-[1.05rem] text-white lg:size-11 lg:rounded-full lg:bg-gold-soft lg:font-sans lg:text-[1rem] lg:font-semibold lg:text-gold-ink">
            {avatarChar}
          </div>
        )}
        <div className="flex-1">
          {/* 모바일 제목 */}
          <h2 className="text-[0.875rem] font-bold leading-[1.27rem] text-ink lg:hidden">
            {adjusterName ? <>{adjusterNameNode} 손해사정사님이 검수해주셨어요</> : "검수 의견"}
          </h2>
          {/* 데스크톱 제목 */}
          <div className="hidden items-center justify-between gap-2 lg:flex">
            <h2 className="text-[1rem] font-semibold text-ink">
              {adjusterName ? <>{adjusterNameNode} 손해사정사의 검수 의견</> : "검수 의견"}
            </h2>
            <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          </div>

          {reviewComment && (
            <p className="mt-2 text-[0.75rem] leading-[1.21rem] text-ink-2 lg:text-[0.875rem] lg:leading-relaxed">
              “{reviewComment}”
            </p>
          )}
          {subtitle && (
            <p className="mt-2 text-[0.65rem] text-ink-3 lg:text-[0.78rem]">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
}
