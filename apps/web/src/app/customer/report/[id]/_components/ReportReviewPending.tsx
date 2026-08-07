import Link from "next/link";
import { Clock } from "@/shared/ui/icons/Clock";
import { reportProposalsHref } from "@/app/customer/_shared/model/report-routes";

export function ReportReviewPending({ reportId }: { reportId: string }) {
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
            아직 검수 대기 중이에요
          </h2>
          <p className="mt-2 text-[0.75rem] leading-[1.21rem] text-ink-2 lg:text-[0.875rem] lg:leading-relaxed">
            손해사정사가 리포트를 검수하면 의견과 상담 제안이 도착해요. 조금만 기다려주세요.
          </p>
          <Link
            href={reportProposalsHref(reportId)}
            className="mt-3 inline-flex text-[0.75rem] font-semibold text-gold-ink underline underline-offset-2 lg:text-[0.8125rem]"
          >
            받은 제안 확인하기
          </Link>
        </div>
      </div>
    </section>
  );
}
