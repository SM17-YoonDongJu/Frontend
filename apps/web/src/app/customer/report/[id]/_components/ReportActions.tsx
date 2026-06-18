"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import type { ReportDetail } from "../_model/types";

export function ReportActions({ report }: { report: ReportDetail }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "보험 보상 분석 리포트", url });
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
    try {
      const [{ pdf }, { ReportPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("../_pdf/ReportPdfDocument"),
      ]);
      const blob = await pdf(<ReportPdfDocument report={report} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `보험보상분석리포트.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex shrink-0 gap-2">
      <Button variant="outline" size="sm" loading={loading} onClick={handlePdf}>
        PDF 저장
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        {copied ? "링크 복사됨" : "공유"}
      </Button>
    </div>
  );
}
