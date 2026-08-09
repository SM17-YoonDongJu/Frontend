"use client";

import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { Upload } from "@/shared/ui/icons/Upload";
import { Button } from "@/shared/ui/Button";
import type { AdjusterApplicationStatus } from "../../_model/adjuster-application.schema";
import { formatDate } from "./date-format";
import { SubmittedDocuments } from "./SubmittedDocuments";

interface RejectResultProps {
  application: AdjusterApplicationStatus;
  onResubmit: () => void;
}

/** 반려(REJECTED) — 반려 사유 + 서류별 검토 결과 + 다시 제출/문의. */
export function RejectResult({ application, onResubmit }: RejectResultProps) {
  const rejectedDate = formatDate(application.rejectedAt);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-[4.5rem] items-center justify-center rounded-full bg-terra-soft text-[1.75rem] text-terra">
        <AlertTriangle />
      </span>
      <p className="mt-5 text-[0.84375rem] font-bold text-terra">인증 반려</p>
      <h1 className="mt-2 font-serif text-[1.75rem] font-bold text-ink">
        서류를 다시 확인해주세요
      </h1>
      <p className="mt-3 break-keep text-sm leading-relaxed text-ink-2">
        아래 사유를 보완해 다시 제출하면 <span className="font-bold text-ink">영업일 1일 내</span>{" "}
        우선 재심사해드려요.
      </p>

      <div className="mt-7 w-full rounded-card border border-terra bg-terra-soft/40 p-5 text-left">
        <p className="text-[0.8125rem] font-bold text-terra">
          반려 사유{rejectedDate ? ` · 운영팀 (${rejectedDate})` : ""}
        </p>
        <p className="mt-2 break-keep text-[0.90625rem] leading-relaxed text-ink-2">
          {application.rejectReason ?? "반려 사유가 곧 전달될 예정이에요."}
        </p>
      </div>

      <div className="mt-4 w-full rounded-card border border-line bg-card px-5 py-2 text-left">
        <SubmittedDocuments documents={application.documents} />
      </div>

      <div className="mt-6 flex w-full items-center justify-center gap-2.5">
        <Button
          variant="outline"
          disabled
          title="문의 기능은 준비 중이에요"
          className="flex-1"
        >
          문의하기
        </Button>
        <Button
          className="flex-1"
          onClick={onResubmit}
          icon={<Upload className="text-[1.125rem]" />}
        >
          서류 다시 제출하기
        </Button>
      </div>
    </div>
  );
}
