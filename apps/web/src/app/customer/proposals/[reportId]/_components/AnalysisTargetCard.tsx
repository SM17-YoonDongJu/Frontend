import { FileText } from "@/shared/ui/icons/FileText";

interface AnalysisTargetCardProps {
  accidentType: string;
  reportNo: string;
  receivedAt: string;
  proposalCount: number;
}

export function AnalysisTargetCard({
  accidentType,
  reportNo,
  receivedAt,
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
        <div className="flex items-baseline gap-2">
          <p className="truncate text-[1rem] font-semibold text-ink">{accidentType}</p>
          <span className="shrink-0 text-[0.8125rem] text-ink-3">No.{reportNo}</span>
        </div>
        <p className="mt-1 text-[0.8125rem] text-ink-3">
          접수 {receivedAt} · 손해사정사 {proposalCount}명이 검수 의견을 보냈어요
        </p>
      </div>
    </section>
  );
}
