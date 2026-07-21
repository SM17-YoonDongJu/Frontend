"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { REPORT_FILENAME, REPORT_TITLE } from "../_model/report-meta";
import type { ReportDetail } from "../_model/types";

export function ReportActions({
  report,
  compact = false,
}: {
  report: ReportDetail;
  /** 모바일 상단 바용 공유 아이콘 버튼 단독 렌더 */
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: REPORT_TITLE, url });
      } catch {
        // 사용자 취소 — 무시
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 미지원 — 무시
    }
  };

  const handlePdf = async () => {
    setLoading(true);
    setPdfError(false);
    try {
      const [{ pdf }, { ReportPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("../_pdf/ReportPdfDocument"),
      ]);
      const blob = await pdf(<ReportPdfDocument report={report} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = REPORT_FILENAME;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setPdfError(true);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? "링크가 복사되었어요" : "공유"}
        className="flex size-[2.375rem] items-center justify-center rounded-full text-ink transition hover:bg-paper-2"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }

  const canReview = report.status === "CLOSED" && report.adjusterId != null;

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex gap-2">
        {canReview && (
          <Link
            href={`/customer/report/${report.reportId}/review`}
            className={buttonVariants({ variant: "gold", size: "sm" })}
          >
            리뷰 남기기
          </Link>
        )}
        <Button variant="outline" size="sm" loading={loading} onClick={handlePdf}>
          PDF 저장
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          {copied ? "링크 복사됨" : "공유"}
        </Button>
      </div>
      {pdfError && (
        <p role="alert" className="text-[0.75rem] text-terra">
          PDF 저장에 실패했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
