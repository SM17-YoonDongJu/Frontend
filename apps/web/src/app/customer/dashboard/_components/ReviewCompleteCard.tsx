"use client";

import { useRouter } from "next/navigation";
import { Bell } from "@/shared/ui/icons/Bell";
import { Button } from "@/shared/ui/Button";
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

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 font-serif text-[20px] font-bold text-ink">
        <Bell className="text-[18px] text-gold" />
        검수 완료 알림
      </h2>

      {completedReviews.length === 0 ? (
        <EmptyState message="확인할 검수 완료 건이 없어요" />
      ) : (
        <div className="flex flex-col gap-3">
          {completedReviews.map((report) => (
            <article
              key={report.reportId}
              className="rounded-card border border-gold-2 bg-gold-soft/40 p-5"
            >
              <p className="text-[14px] text-ink-2">
                <span className="font-semibold text-ink">
                  {report.adjusterNickname ?? "담당"} 손해사정사
                </span>
                님이 검수해주셨어요
              </p>
              <p className="mt-1 text-[13px] text-ink-3">
                {report.accidentType} · No.{report.reportNo}
              </p>
              <Button
                size="sm"
                className="mt-4 bg-gold-soft text-gold-ink"
                onClick={() => openReview(report.reportId)}
              >
                검수 리포트 확인
              </Button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
