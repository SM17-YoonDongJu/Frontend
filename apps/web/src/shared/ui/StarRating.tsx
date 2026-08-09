import { cn } from "@/shared/lib/utils";
import { RatingStar } from "@/shared/ui/icons/RatingStar";

export interface StarRatingProps {
  /** 평점(0~5). 정수로 반올림해 채워진 별 수를 결정 */
  score: number;
  /** 별 개수 (기본 5) */
  max?: number;
  /** 별 한 변 크기(rem) */
  size?: number;
  className?: string;
}

export function StarRating({ score, max = 5, size = 0.875, className }: StarRatingProps) {
  const filled = Math.round(score);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`5점 만점에 ${score}점`}
    >
      {Array.from({ length: max }, (_, i) => (
        <RatingStar key={i} filled={i < filled} size={size} />
      ))}
    </span>
  );
}
