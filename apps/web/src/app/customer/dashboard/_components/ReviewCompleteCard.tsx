"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "@/shared/ui/Avatar";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { useReportList } from "../_api/use-report-list";
import { useViewedReviews } from "../_hooks/use-viewed-reviews";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import { EmptyState } from "./EmptyState";

export function ReviewCompleteCard() {
  const router = useRouter();
  const { data: reportList } = useReportList();
  const { isViewed, markViewed } = useViewedReviews();

  const completedReviews = reportList.list.filter(
    (report) => report.status === "MATCHED" && !isViewed(report.reportId),
  );

  const openReview = (reportId: string) => {
    markViewed(reportId);
    router.push(DASHBOARD_LINKS.report(reportId));
  };

  if (completedReviews.length === 0) {
    return (
      <section>
        <CardHeader />
        <div className="mt-3 rounded-card border border-line bg-card p-[1.4375rem]">
          <EmptyState message="확인할 검수 완료 건이 없어요" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      {completedReviews.map((report) => (
        <article
          key={report.reportId}
          className="rounded-card border border-line bg-card p-[1.4375rem]"
        >
          <CardHeader />
          <div className="mt-3 flex items-center gap-3">
            <Avatar name={report.adjusterNickname ?? "담"} className="text-[2.625rem]" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.875rem] font-bold text-ink">
                {report.adjusterNickname ?? "담당"} 손해사정사님이
              </p>
              <p className="text-[0.8125rem] text-ink-2">검수해주셨어요</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openReview(report.reportId)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-button bg-ink py-[0.8125rem] text-[0.9375rem] font-semibold text-white transition hover:brightness-110"
          >
            검수 리포트 확인
            <ArrowRight className="text-[1.0625rem]" />
          </button>
        </article>
      ))}
    </section>
  );
}

function CardHeader() {
  return (
    <h2 className="flex items-center gap-[0.5625rem] text-[0.96875rem] font-bold text-ink">
      <ShieldCheck className="text-[1.125rem] text-gold" />
      검수 완료 알림
    </h2>
  );
}
