import { cn } from "@/shared/lib/utils";
import { FileText } from "@/shared/ui/icons/FileText";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import type { SubmittedDocument } from "../../_model/adjuster-application.schema";

const DOCUMENT_LABEL: Record<string, string> = {
  LICENSE: "자격증 사본",
  REGISTRATION: "등록확인서",
  ID_CARD: "신분증",
};

const STATUS_META: Record<
  SubmittedDocument["status"],
  { label: string; tone: "neutral" | "green" | "terra" }
> = {
  PENDING: { label: "검토 중", tone: "neutral" },
  APPROVED: { label: "승인됨", tone: "green" },
  RESUBMIT_REQUIRED: { label: "재제출 필요", tone: "terra" },
};

interface SubmittedDocumentsProps {
  documents: SubmittedDocument[];
  className?: string;
}

/** 제출 서류 리스트 — 서류 종류·심사 상태(타임라인·반려 공용). */
export function SubmittedDocuments({ documents, className }: SubmittedDocumentsProps) {
  if (documents.length === 0) {
    return (
      <p className={cn("text-center text-sm text-ink-3", className)}>제출한 서류가 없어요.</p>
    );
  }

  return (
    <ul className={cn("flex flex-col divide-y divide-line-2", className)}>
      {documents.map((doc, index) => {
        const meta = STATUS_META[doc.status];
        return (
          <li key={`${doc.type}-${index}`} className="flex items-center justify-between gap-3 py-3">
            <span className="flex items-center gap-2.5 text-[0.90625rem] font-semibold text-ink">
              <FileText className="text-[1.125rem] text-ink-3" />
              {DOCUMENT_LABEL[doc.type] ?? doc.type}
            </span>
            <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          </li>
        );
      })}
    </ul>
  );
}
