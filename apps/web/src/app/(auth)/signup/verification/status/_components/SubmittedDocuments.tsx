import { cn } from "@/shared/lib/utils";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { Check } from "@/shared/ui/icons/Check";
import type {
  DocumentReview,
  DocumentReviewStatus,
  DocumentType,
} from "../../_model/adjuster-application.schema";

const DOCUMENT_LABEL: Record<DocumentType, string> = {
  LICENSE: "자격증 사본",
  REGISTRATION: "등록확인서",
};

const STATUS_LABEL: Record<DocumentReviewStatus, string> = {
  APPROVED: "확인 완료",
  RESUBMIT_REQUIRED: "재제출 필요",
  PENDING: "검토 중",
};

interface SubmittedDocumentsProps {
  documents: DocumentReview[];
  className?: string;
}

/** 제출 서류 리스트 — 서류별 검토 결과(타임라인·반려 공용). */
export function SubmittedDocuments({ documents, className }: SubmittedDocumentsProps) {
  if (documents.length === 0) {
    return (
      <p className={cn("text-center text-sm text-ink-3", className)}>제출한 서류가 없어요.</p>
    );
  }

  return (
    <ul className={cn("flex flex-col divide-y divide-line-2", className)}>
      {documents.map((doc) => {
        const resubmit = doc.status === "RESUBMIT_REQUIRED";
        const approved = doc.status === "APPROVED";
        return (
          <li key={doc.type} className="flex items-center justify-between gap-3 py-3">
            <span className="flex items-center gap-2.5 text-[0.90625rem] font-semibold text-ink">
              {approved ? (
                <Check className="text-[1.125rem] text-green" />
              ) : resubmit ? (
                <AlertTriangle className="text-[1.125rem] text-terra" />
              ) : (
                <span className="size-1.5 rounded-pill bg-ink-3" aria-hidden />
              )}
              {DOCUMENT_LABEL[doc.type]}
            </span>
            <span
              className={cn(
                "shrink-0 text-[0.8125rem] font-bold",
                approved ? "text-green" : resubmit ? "text-terra" : "text-ink-3",
              )}
            >
              {STATUS_LABEL[doc.status]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
