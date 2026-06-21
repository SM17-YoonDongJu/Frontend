interface AnalysisTargetCardProps {
  accidentType: string;
  proposalCount: number;
}

export function AnalysisTargetCard({ accidentType, proposalCount }: AnalysisTargetCardProps) {
  return (
    <section className="flex items-center gap-4 rounded-card-lg bg-navy px-5 py-4 text-white">
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-white/10"
      >
        <DocumentIcon />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[16px] font-semibold">{accidentType}</p>
        <p className="mt-1 text-[13px] text-white/70">
          손해사정사 {proposalCount}명이 검수 의견을 보냈어요
        </p>
      </div>
    </section>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}
