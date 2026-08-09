import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";
import { FileText } from "@/shared/ui/icons/FileText";
import { MessageSquare } from "@/shared/ui/icons/MessageSquare";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}

export function CaseRow({ report }: { report: ReportListItem }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10.5 shrink-0 items-center justify-center rounded-button bg-gold-soft text-gold-ink">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9375rem] font-bold text-ink">
          {report.accidentType ?? ""}
        </p>
        <p className="mt-0.5 truncate text-[0.75rem] text-ink-3">
          No.{report.reportNo} · {formatDate(report.createdAt)}
        </p>
      </div>
      {report.proposalCount > 0 && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-paper-2 px-2.5 py-1 text-[0.75rem] font-bold text-ink-2">
          <MessageSquare className="size-3" />
          제안 {report.proposalCount}건
        </span>
      )}
    </div>
  );
}
