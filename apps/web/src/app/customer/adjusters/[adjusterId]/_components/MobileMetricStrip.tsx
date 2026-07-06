import { StarRating } from "@/shared/ui/StarRating";

interface MobileMetricStripProps {
  averageRating: number;
  completedConsultCount: number;
  onRatingClick: () => void;
}

export function MobileMetricStrip({
  averageRating,
  completedConsultCount,
  onRatingClick,
}: MobileMetricStripProps) {
  return (
    <div className="mx-5 grid grid-cols-2 divide-x divide-line-2 rounded-card border border-line bg-card lg:hidden">
      <button
        type="button"
        onClick={onRatingClick}
        className="flex flex-col items-center gap-1 py-4 transition hover:bg-paper-2"
      >
        <span className="flex items-center gap-1 font-serif text-xl font-bold text-ink">
          <StarRating score={averageRating} max={1} size={1} />
          {averageRating.toFixed(1)}
        </span>
        <span className="text-xs text-ink-3">평점</span>
      </button>
      <div className="flex flex-col items-center gap-1 py-4">
        <span className="font-serif text-xl font-bold text-ink">{completedConsultCount}+</span>
        <span className="text-xs text-ink-3">상담</span>
      </div>
    </div>
  );
}
