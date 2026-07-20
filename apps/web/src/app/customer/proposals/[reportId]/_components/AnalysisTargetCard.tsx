import { FileText } from "@/shared/ui/icons/FileText";

interface AnalysisTargetCardProps {
  accidentType: string;
  reportNo: string;
  proposalCount: number;
}

export function AnalysisTargetCard({
  accidentType,
  reportNo,
  proposalCount,
}: AnalysisTargetCardProps) {
  return (
    <section className="flex items-center gap-4 rounded-input border border-line bg-paper-2 px-5 py-4">
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-gold-soft text-gold-ink"
      >
        <FileText className="text-[1.25rem]" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[1rem] font-semibold text-ink">{accidentType} 리포트</p>
        <p className="mt-1 text-[0.8125rem] text-ink-3">
          No.{reportNo} · 제안 {proposalCount}건
        </p>
      </div>
    </section>
  );
}
